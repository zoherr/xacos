import { Request, Response } from "express";
import * as {{moduleName}}Service from "../services/{{moduleName}}.service";
import { sendResponse, sendError } from "../utils/response";
import { I{{ModuleName}}, ICreate{{ModuleName}}, IUpdate{{ModuleName}} } from "../interfaces/{{moduleName}}.interface";

export const get{{ModuleName}}s = async (req: Request, res: Response): Promise<Response> => {
  try {
    const {{moduleName}}s: I{{ModuleName}}[] = await {{moduleName}}Service.getAll{{ModuleName}}s();
    return sendResponse(res, 200, "{{ModuleName}}s retrieved successfully", {{moduleName}}s);
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};

export const get{{ModuleName}}ById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const {{moduleName}}: I{{ModuleName}} | null = await {{moduleName}}Service.get{{ModuleName}}ById(id);
    if (!{{moduleName}}) {
      return sendError(res, 404, "{{ModuleName}} not found");
    }
    return sendResponse(res, 200, "{{ModuleName}} retrieved successfully", {{moduleName}});
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};

export const create{{ModuleName}} = async (req: Request<{}, {}, ICreate{{ModuleName}}>, res: Response): Promise<Response> => {
  try {
    const {{moduleName}}: I{{ModuleName}} = await {{moduleName}}Service.create{{ModuleName}}(req.body);
    return sendResponse(res, 201, "{{ModuleName}} created successfully", {{moduleName}});
  } catch (error: any) {
    return sendError(res, 400, error.message);
  }
};

export const update{{ModuleName}} = async (req: Request<{ id: string }, {}, IUpdate{{ModuleName}}>, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const {{moduleName}}: I{{ModuleName}} | null = await {{moduleName}}Service.update{{ModuleName}}(id, req.body);
    if (!{{moduleName}}) {
      return sendError(res, 404, "{{ModuleName}} not found");
    }
    return sendResponse(res, 200, "{{ModuleName}} updated successfully", {{moduleName}});
  } catch (error: any) {
    return sendError(res, 400, error.message);
  }
};

export const delete{{ModuleName}} = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const deleted: boolean = await {{moduleName}}Service.delete{{ModuleName}}(id);
    if (!deleted) {
      return sendError(res, 404, "{{ModuleName}} not found");
    }
    return sendResponse(res, 200, "{{ModuleName}} deleted successfully");
  } catch (error: any) {
    return sendError(res, 500, error.message);
  }
};

