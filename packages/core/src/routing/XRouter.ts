import type { XMiddleware, XRequest, XResponse } from "@xaocs/shared";

type Handler = (req: XRequest, res: XResponse) => Promise<void> | void;

export interface RouteDefinition {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  handler: Handler;
  middlewares: XMiddleware[];
}

export class XRouter {
  public readonly routes: RouteDefinition[] = [];
  private readonly routeMiddlewares: XMiddleware[] = [];

  use(...middlewares: XMiddleware[]): this {
    this.routeMiddlewares.push(...middlewares);
    return this;
  }

  group(prefix: string, callback: (router: XRouter) => void): this {
    const subRouter = new XRouter();
    callback(subRouter);

    for (const route of subRouter.routes) {
      this.routes.push({
        ...route,
        path: `${prefix}${route.path}`,
      });
    }

    return this;
  }

  get(path: string, ...args: [...XMiddleware[], Handler]): this {
    return this.addRoute("GET", path, args);
  }

  post(path: string, ...args: [...XMiddleware[], Handler]): this {
    return this.addRoute("POST", path, args);
  }

  put(path: string, ...args: [...XMiddleware[], Handler]): this {
    return this.addRoute("PUT", path, args);
  }

  patch(path: string, ...args: [...XMiddleware[], Handler]): this {
    return this.addRoute("PATCH", path, args);
  }

  delete(path: string, ...args: [...XMiddleware[], Handler]): this {
    return this.addRoute("DELETE", path, args);
  }

  private addRoute(method: RouteDefinition["method"], path: string, args: unknown[]): this {
    const maybeHandler = args.at(-1);
    if (!isHandler(maybeHandler)) {
      throw new Error("[XAOCS Router] Handler is required");
    }

    const middlewares = [
      ...this.routeMiddlewares,
      ...(args.slice(0, -1) as XMiddleware[]),
    ];

    this.routes.push({
      method,
      path,
      middlewares,
      handler: maybeHandler,
    });

    return this;
  }
}

function isHandler(value: unknown): value is Handler {
  return typeof value === "function";
}
