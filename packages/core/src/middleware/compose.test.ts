import { describe, expect, it } from "bun:test";
import type { XRequest, XResponse } from "@xacos/shared";
import { compose } from "./compose";

describe("compose", () => {
  it("runs middleware in order", async () => {
    const order: number[] = [];

    const middleware1 = async (
      _req: XRequest,
      _res: XResponse,
      next: () => Promise<void>,
    ) => {
      order.push(1);
      await next();
    };

    const middleware2 = async (
      _req: XRequest,
      _res: XResponse,
      next: () => Promise<void>,
    ) => {
      order.push(2);
      await next();
    };

    const req = {
      params: {},
      query: {},
      body: {},
      headers: {},
      app: { make: <T>(_key: string) => ({}) as T },
    } as XRequest;

    const res = createResponse();

    await compose([middleware1, middleware2])(req, res);

    expect(order).toEqual([1, 2]);
  });
});

function createResponse(): XResponse {
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

