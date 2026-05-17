import Fastify, { FastifyInstance } from "fastify";
import type { XApp, XMiddleware } from "@xacos/shared";
import { mountApiRoutes } from "./routing/mountApiRoutes";
import cookie from "@fastify/cookie";
import multipart from "@fastify/multipart";
import formbody from "@fastify/formbody";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";

import type { XacosConfig } from "@xacos/config";
import { log } from "./Logger";
import { closeDb } from "@xacos/orm";
import pkg from "../package.json";

let shutdownRegistered = false;

export class XServer {
  public readonly fastify: FastifyInstance;
  private readonly globalMiddlewares: XMiddleware[] = [];

  constructor() {
    const isDev = process.env["APP_ENV"] !== "production";
    this.fastify = Fastify({
      bodyLimit: 10 * 1024 * 1024, // 10MB max body size
      logger: {
        level: process.env["APP_DEBUG"] === "true" || isDev ? "debug" : "info",
        transport: isDev
          ? {
            target: "pino-pretty",
            options: {
              translateTime: "HH:MM:ss Z",
              ignore: "pid,hostname",
            },
          }
          : undefined,
      } as any,
    });

    this.fastify.addHook('onSend', async (_request, reply) => {
      reply.header('X-Content-Type-Options', 'nosniff');
      reply.header('X-Frame-Options', 'SAMEORIGIN');
      reply.header('X-XSS-Protection', '1; mode=block');
      reply.header('Referrer-Policy', 'strict-origin-when-cross-origin');
      if (process.env['APP_ENV'] === 'production') {
        reply.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
      }
    });

    void this.fastify.register(cookie as any);
    void this.fastify.register(formbody as any);
    const metaSym = Symbol.for('plugin-meta');
    if ((multipart as any)[metaSym]) {
      (multipart as any)[metaSym].fastify = '4.x';
    }
    void this.fastify.register(multipart as any, {
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB default
      },
    });

    this.setupErrorHandler();
    this.setupHealthCheck();
  }

  private setupHealthCheck() {
    this.fastify.get("/health", async (_req, reply) => {
      return reply.send({
        status: "ok",
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: pkg.version,
        env: process.env["APP_ENV"] ?? "development",
      });
    });
  }

  async bootstrap(config: XacosConfig): Promise<void> {
    // ── CORS ────────────────────────────────────────────────────────────────
    await this.fastify.register(cors as any, {
      origin: config.cors?.origin ?? true,
      credentials: config.cors?.credentials ?? true,
      methods: config.cors?.methods ?? ["GET", "POST", "PUT", "DELETE", "PATCH"],
    });

    // ── Rate Limit ──────────────────────────────────────────────────────────
    await this.fastify.register(rateLimit as any, {
      max: config.rateLimit?.max ?? 100,
      timeWindow: config.rateLimit?.timeWindow ?? "1 minute",
    });
  }

  private setupErrorHandler() {
    this.fastify.setErrorHandler((error, request, reply) => {
      const statusCode = error.statusCode ?? 500;
      const isDev = process.env["APP_ENV"] !== "production";

      let code = (error as any).code;
      if (!code) {
        if (statusCode === 422 || error.name === "ValidationError") code = "VALIDATION_FAILED";
        else if (statusCode === 404) code = "NOT_FOUND";
        else if (statusCode === 401) code = "UNAUTHORIZED";
        else if (statusCode === 403) code = "FORBIDDEN";
        else if (statusCode === 400) code = "BAD_REQUEST";
        else code = "INTERNAL_ERROR";
      }

      // Structured logging via Pino per error
      log.error(`[XServer Error] ${error.message}`, {
        url: request.url,
        method: request.method,
        statusCode,
        code,
        stack: isDev ? error.stack : undefined,
      });

      request.log.error(error);

      void reply.status(statusCode).send({
        success: false,
        error: {
          message: error.message || "Internal Server Error",
          code,
          details: (error as any).details || (error as any).errors,
          stack: isDev ? error.stack : undefined,
        },
      });
    });
  }

  useGlobal(middleware: XMiddleware): void {
    this.globalMiddlewares.push(middleware);
  }

  getGlobalMiddlewares(): readonly XMiddleware[] {
    return [...this.globalMiddlewares];
  }

  /**
   * Scan `apiDir` for `*.api.ts` modules and register routes on this Fastify instance.
   */
  async mountApi(apiDir: string, app: XApp): Promise<void> {
    await mountApiRoutes(this.fastify, apiDir, app);
  }

  async listen(port: number): Promise<void> {
    await this.fastify.listen({ port, host: "0.0.0.0" });
    console.log(`\n  XAOCS running at http://localhost:${port}\n`);

    if (!shutdownRegistered && process.env["APP_ENV"] !== "test") {
      shutdownRegistered = true;
      const gracefulShutdown = async (signal: string) => {
        log.info(`Received ${signal} — shutting down gracefully...`);
        try {
          await this.close();
          await closeDb();
          process.exit(0);
        } catch (err) {
          log.error(`Error during graceful shutdown: ${(err as Error).message}`);
          process.exit(1);
        }
      };

      process.on("SIGTERM", () => void gracefulShutdown("SIGTERM"));
      process.on("SIGINT", () => void gracefulShutdown("SIGINT"));
    }
  }

  async close(): Promise<void> {
    await this.fastify.close();
  }
}

