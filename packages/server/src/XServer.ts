import Fastify, { FastifyInstance } from "fastify";
import type { XApp, XMiddleware } from "@xaocs/shared";
import { mountApiRoutes } from "./routing/mountApiRoutes";

export class XServer {
  public readonly fastify: FastifyInstance;
  private readonly globalMiddlewares: XMiddleware[] = [];

  constructor() {
    this.fastify = Fastify({
      logger:
        process.env["APP_ENV"] !== "production"
          ? { level: "info" }
          : false,
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
  }

  async close(): Promise<void> {
    await this.fastify.close();
  }
}
