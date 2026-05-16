import type { ZodTypeAny } from "zod";
import type { XMiddleware, XRequest, XResponse } from "@xacos/shared";

type Handler = (req: XRequest, res: XResponse) => Promise<unknown> | unknown;

export interface RouteValidationSchema {
  body?: ZodTypeAny;
  query?: ZodTypeAny;
  params?: ZodTypeAny;
}

export interface RouteDefinition {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  handler: Handler;
  middlewares: XMiddleware[];
  schema?: RouteValidationSchema;
}

type RouteRest = [...XMiddleware[], Handler] | [...XMiddleware[], RouteSchemaThunk, Handler];

interface RouteSchemaThunk {
  schema?: RouteValidationSchema;
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

  get(path: string, ...args: RouteRest): this {
    return this.addRoute("GET", path, args as unknown[]);
  }

  post(path: string, ...args: RouteRest): this {
    return this.addRoute("POST", path, args as unknown[]);
  }

  put(path: string, ...args: RouteRest): this {
    return this.addRoute("PUT", path, args as unknown[]);
  }

  patch(path: string, ...args: RouteRest): this {
    return this.addRoute("PATCH", path, args as unknown[]);
  }

  delete(path: string, ...args: RouteRest): this {
    return this.addRoute("DELETE", path, args as unknown[]);
  }

  private addRoute(method: RouteDefinition["method"], path: string, args: unknown[]): this {
    const maybeHandler = args.at(-1);
    if (!isHandler(maybeHandler)) {
      throw new Error("[XAOCS Router] Handler is required");
    }

    const rest = args.slice(0, -1);
    let schema: RouteValidationSchema | undefined;
    let middlewareSlice = rest;

    if (rest.length > 0 && isSchemaThunk(rest.at(-1))) {
      schema = (rest.at(-1) as RouteSchemaThunk).schema;
      middlewareSlice = rest.slice(0, -1);
    }

    const middlewares = [...this.routeMiddlewares, ...(middlewareSlice as XMiddleware[])];

    const definition: RouteDefinition = {
      method,
      path,
      middlewares,
      handler: maybeHandler,
    };
    if (schema !== undefined) {
      definition.schema = schema;
    }
    this.routes.push(definition);

    return this;
  }
}

function isSchemaThunk(value: unknown): value is RouteSchemaThunk {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  const keys = Object.keys(value as object);
  if (keys.length !== 1 || keys[0] !== "schema") return false;
  const s = (value as RouteSchemaThunk).schema;
  if (s === undefined) return true;
  if (s === null || typeof s !== "object" || Array.isArray(s)) return false;
  const sk = Object.keys(s);
  return sk.every((k) => k === "body" || k === "query" || k === "params");
}

function isHandler(value: unknown): value is Handler {
  return typeof value === "function";
}

