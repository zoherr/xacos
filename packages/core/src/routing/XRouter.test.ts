import { describe, expect, it } from "bun:test";
import type { XRequest, XResponse } from "@xaocs/shared";
import { XRouter } from "./XRouter";

function createReq(): XRequest {
  return {
    params: {},
    query: {},
    body: {},
    headers: {},
    app: { make: <T>(_key: string) => ({}) as T },
  };
}

function createRes(): XResponse {
  let self!: XResponse;
  self = {
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

    router.get("/", async (_req, _res) => {});

    expect(router.routes.length).toBe(1);
    expect(router.routes[0]?.method).toBe("GET");
  });

  it("supports grouped routes", async () => {
    const router = new XRouter();

    router.group("/admin", (r) => {
      r.get("/", async (_req, _res) => {});
    });

    expect(router.routes[0]?.path).toBe("/admin/");
  });

  it("executes route handler signature", async () => {
    const router = new XRouter();
    let seen = false;

    router.post("/", async (req, res) => {
      const _ = req.params;
      res.status(201).json({ ok: true });
      seen = true;
    });

    await router.routes[0]?.handler(createReq(), createRes());
    expect(seen).toBe(true);
  });
});
