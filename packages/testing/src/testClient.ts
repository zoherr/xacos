import Fastify, { type FastifyInstance } from 'fastify';
import { mountApiRoutes } from '@xacos/server';
import { application } from '@xacos/core';
import cookie from '@fastify/cookie';
import formbody from '@fastify/formbody';
import http from 'node:http';

const originalWriteHead = http.ServerResponse.prototype.writeHead;
(http.ServerResponse.prototype as any).writeHead = function (...args: any[]) {
  const result = (originalWriteHead as any).apply(this, args);
  if (this._header === undefined) {
    this._header = '\r\nDate: Mon, 01 Jan 2026 00:00:00 GMT\r\nConnection: keep-alive\r\nTransfer-Encoding: chunked\r\n';
  }
  return result;
};

export interface TestClientOptions {
  apiDir?: string;
  boot?: boolean;
}

export interface TestResponse<T = unknown> {
  status: number;
  body: T;
  headers: Record<string, string>;
}

export interface TestClient {
  get<T = unknown>(url: string, opts?: RequestInit): Promise<TestResponse<T>>;
  post<T = unknown>(url: string, body?: unknown, opts?: RequestInit): Promise<TestResponse<T>>;
  put<T = unknown>(url: string, body?: unknown, opts?: RequestInit): Promise<TestResponse<T>>;
  patch<T = unknown>(url: string, body?: unknown, opts?: RequestInit): Promise<TestResponse<T>>;
  delete<T = unknown>(url: string, opts?: RequestInit): Promise<TestResponse<T>>;
  close(): Promise<void>;
}

/**
 * Create a test HTTP client that spins up a real Fastify server in-process.
 *
 * @example
 * const client = await testClient({ apiDir: './api' });
 * const res = await client.get('/api/user');
 * expect(res.status).toBe(200);
 * await client.close();
 */
export async function testClient(options: TestClientOptions = {}): Promise<TestClient> {
  const { apiDir = './api', boot = true } = options;

  if (boot) {
    await application.boot({
      servicesDir: './app/services',
      middlewaresDir: './app/middlewares',
    });
  }

  const fastify: FastifyInstance = Fastify({ logger: false, ignoreTrailingSlash: true });

  await fastify.register(cookie as any);
  await fastify.register(formbody as any);

  await mountApiRoutes(fastify, apiDir, application.container as any);

  fastify.setErrorHandler((err, req, reply) => {
    console.error("FASTIFY ERROR HANDLER CAUGHT:", err);
    void reply.status(500).send(err);
  });

  await fastify.ready();

  async function request<T>(method: string, url: string, body?: unknown, opts?: RequestInit): Promise<TestResponse<T>> {
    const headers: any = {
      ...(opts?.headers as Record<string, string>),
    };
    if (body !== undefined) {
      headers['content-type'] = 'application/json';
    }

    const injectOpts: any = {
      method: method as any,
      url,
      headers,
    };
    if (body !== undefined) {
      injectOpts.payload = JSON.stringify(body);
    }

    const res = await (fastify.inject(injectOpts) as any);

    let parsed: any;
    try {
      parsed = JSON.parse(res.body);
    } catch {
      parsed = res.body;
    }

    return {
      status: res.statusCode,
      body: parsed,
      headers: res.headers as Record<string, string>,
    };
  }

  return {
    get: <T>(url: string, opts?: RequestInit) => request<T>('GET', url, undefined, opts),
    post: <T>(url: string, body?: unknown, opts?: RequestInit) => request<T>('POST', url, body, opts),
    put: <T>(url: string, body?: unknown, opts?: RequestInit) => request<T>('PUT', url, body, opts),
    patch: <T>(url: string, body?: unknown, opts?: RequestInit) => request<T>('PATCH', url, body, opts),
    delete: <T>(url: string, opts?: RequestInit) => request<T>('DELETE', url, undefined, opts),
    close: async () => {
      await fastify.close();
    },
  };
}

