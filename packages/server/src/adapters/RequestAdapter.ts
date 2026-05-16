import type { FastifyReply, FastifyRequest } from "fastify";
import type { CookieOptions, XApp, XRequest, XResponse } from "@xacos/shared";
import "@fastify/multipart";
import { z } from 'zod';

export function adaptRequest(req: FastifyRequest, app: XApp): XRequest {
  const xReq: XRequest = {
    params: (req.params as Record<string, string>) ?? {},
    query: (req.query as Record<string, string>) ?? {},
    body: req.body,
    headers: req.headers as Record<string, string | string[] | undefined>,
    cookies: ((req as any).cookies as Record<string, string> | undefined) ?? {},
    app,
    validate(schema) {
      const result = schema.safeParse(this.body);
      if (!result.success) {
        const error: any = new Error('Validation failed');
        error.statusCode = 422;
        error.code = 'VALIDATION_ERROR';
        error.details = result.error.flatten().fieldErrors;
        throw error;
      }
      return result.data;
    },
    async file(name: string) {
      if (!(req as any).isMultipart()) return undefined;
      
      const fileIter = (req as any).files();
      for await (const part of fileIter) {
        if (part.fieldname === name) {
          return createXFile(part, app);
        }
      }
      return undefined;
    },
    async files(name?: string) {
      if (!(req as any).isMultipart()) return [];

      const results = [];
      const fileIter = (req as any).files();
      for await (const part of fileIter) {
        if (!name || part.fieldname === name) {
          results.push(createXFile(part, app));
        }
      }
      return results;
    }
  };
  return xReq;
}

function createXFile(part: any, app: XApp) {
  return {
    fieldname: part.fieldname,
    filename: part.filename,
    mimetype: part.mimetype,
    encoding: part.encoding,
    async getBuffer() {
      return await part.toBuffer();
    },
    async store(path: string) {
      const buf = await part.toBuffer();
      const storage = app.make<any>('storage');
      await storage.put(path, buf);
      return path;
    }
  };
}




export function adaptResponse(reply: FastifyReply): XResponse {
  const res: any = {
    _payload: undefined,
    json(data: unknown) {
      this._payload = data;
      return res;
    },
    status(code: number) {
      reply.code(code);
      return res;
    },
    send(data?: string) {
      this._payload = data ?? "";
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

