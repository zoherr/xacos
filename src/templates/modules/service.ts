import * as {{moduleName}}Model from "../models/{{moduleName}}.model.js";
import { I{{ModuleName}}, ICreate{{ModuleName}}, IUpdate{{ModuleName}} } from "../interfaces/{{moduleName}}.interface.js";

export const getAll{{ModuleName}}s = async (): Promise<I{{ModuleName}}[]> => {
  return await {{moduleName}}Model.findAll();
};

export const get{{ModuleName}}ById = async (id: string | number): Promise<I{{ModuleName}} | null> => {
  return await {{moduleName}}Model.findById(id);
};

export const create{{ModuleName}} = async (data: ICreate{{ModuleName}}): Promise<I{{ModuleName}}> => {
  return await {{moduleName}}Model.create(data);
};

export const update{{ModuleName}} = async (id: string | number, data: IUpdate{{ModuleName}}): Promise<I{{ModuleName}} | null> => {
  return await {{moduleName}}Model.update(id, data);
};

export const delete{{ModuleName}} = async (id: string | number): Promise<boolean> => {
  const result = await {{moduleName}}Model.remove(id);
  return !!result;
};

