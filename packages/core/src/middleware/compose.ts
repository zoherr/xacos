import type { XMiddleware, XRequest, XResponse } from "@xaocs/shared";

export function compose(middlewares: readonly XMiddleware[]) {
  return async function pipeline(req: XRequest, res: XResponse): Promise<void> {
    let index = -1;

    async function dispatch(i: number): Promise<void> {
      if (i <= index) {
        throw new Error("[XAOCS] next() called multiple times");
      }

      index = i;
      const fn = middlewares[i];
      if (!fn) {
        return;
      }

      await fn(req, res, () => dispatch(i + 1));
    }

    await dispatch(0);
  };
}
