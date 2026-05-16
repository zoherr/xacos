import { describe, expect, it } from "bun:test";
import type { FastifyReply, FastifyRequest } from "fastify";
import { adaptRequest, adaptResponse } from "./RequestAdapter";

describe("RequestAdapter", () => {
  it("adapts request shape", () => {
    const req = {
      params: { id: "42" },
      query: { q: "ok" },
      body: { x: 1 },
      headers: { "x-test": "1" },
    } as unknown as FastifyRequest;

    const app = {
      make: <T>(_key: string) => ({}) as T,
    };

    const adapted = adaptRequest(req, app);

    expect(adapted.params["id"]).toBe("42");
    expect(adapted.query["q"]).toBe("ok");
  });

  it("adapts response shape", () => {
    let statusCode = 200;
    let payload: unknown;

    const reply = {
      code(code: number) {
        statusCode = code;
        return this;
      },
      send(data: unknown) {
        payload = data;
        return this;
      },
      redirect(_url: string) {},
    } as unknown as FastifyReply;

    const adapted = adaptResponse(reply);

    adapted.status(201).json({ ok: true });

    expect(statusCode).toBe(201);
    expect((adapted as any)._payload).toEqual({ ok: true });
  });
});

