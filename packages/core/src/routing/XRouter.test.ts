import { describe, expect, it } from "bun:test";
import type { XRequest, XResponse } from "@xacos/shared";
import { z } from "zod";
import { XRouter } from "./XRouter";

function createReq(): XRequest {
  const req = {
    params: {},
    query: {},
    body: {},
    headers: {},
    cookies: {},
    app: {
      make: <T>(_key: string) => ({} as T),
    },
    validate: (schema: any) => schema.parse({}),
    file: async (_name: string) => undefined,
    files: async (_name?: string) => [],
  } as XRequest;

  return req;
}


function createRes(): XResponse {
  let self!: XResponse;
  self = {
    setHeader: (_name: string, _value: string) => self,
    json: (_data: unknown) => self,
    status: (_code: number) => self,
    send: (_data?: string) => self,
    redirect: (_url: string) => {},
    setCookie: (_name: string, _value: string) => self,
  };

  return self;
}

describe("XRouter", () => {
  it("registers route definitions", async () => {
    const router = new XRouter();

    router.get("/", async (_req: XRequest, _res: XResponse) => {});

    expect(router.routes.length).toBe(1);
    expect(router.routes[0]?.method).toBe("GET");
  });

  it("supports grouped routes", async () => {
    const router = new XRouter();

    router.group("/admin", (r) => {
      r.get("/", async (_req: XRequest, _res: XResponse) => {});
    });

    expect(router.routes[0]?.path).toBe("/admin/");
  });

  it("executes route handler signature", async () => {
    const router = new XRouter();
    let seen = false;

    router.post("/", async (req: XRequest, res: XResponse) => {
      const _ = req.params;
      res.status(201).json({ ok: true });
      seen = true;
    });

    await router.routes[0]?.handler(createReq(), createRes());
    expect(seen).toBe(true);
  });

  it("stores optional route schema attached before handler", () => {
    const router = new XRouter();
    const bodySchema = z.object({ foo: z.string() });

    router.post("/", { schema: { body: bodySchema } }, async (_req: XRequest, res: XResponse) => {
      res.status(204).send();
    });

    expect(router.routes[0]?.schema?.body).toBe(bodySchema);
  });
});

