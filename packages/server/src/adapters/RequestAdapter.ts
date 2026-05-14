import type { FastifyReply, FastifyRequest } from "fastify";
import type { CookieOptions, XApp, XRequest, XResponse } from "@xaocs/shared";

export function adaptRequest(req: FastifyRequest, app: XApp): XRequest {
  return {
    params: (req.params as Record<string, string>) ?? {},
    query: (req.query as Record<string, string>) ?? {},
    body: req.body,
    headers: req.headers as Record<string, string | string[] | undefined>,
    app,
  };
}

export function adaptResponse(reply: FastifyReply): XResponse {
  const res: XResponse = {
    json(data: unknown) {
      reply.send(data);
      return res;
    },
    status(code: number) {
      reply.code(code);
      return res;
    },
    send(data?: string) {
      reply.send(data);
      return res;
    },
    redirect(url: string) {
      reply.redirect(url);
    },
    setCookie(name: string, value: string, opts?: CookieOptions) {
      const cookieReply = reply as FastifyReply & {
        setCookie?: (cookieName: string, cookieValue: string, cookieOpts?: CookieOptions) => void;
      };

      cookieReply.setCookie?.(name, value, opts);
      return res;
    },
  };

  return res;
}
