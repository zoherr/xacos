import * as {{moduleName}}Model from "../models/{{moduleName}}.model.{{ext}}";

export const getAll{{ModuleName}}s = async () => {
  return await {{moduleName}}Model.findAll();
};

export const get{{ModuleName}}ById = async (id) => {
  return await {{moduleName}}Model.findById(id);
};

export const create{{ModuleName}} = async (data) => {
  return await {{moduleName}}Model.create(data);
};

export const update{{ModuleName}} = async (id, data) => {
  return await {{moduleName}}Model.update(id, data);
};

export const delete{{ModuleName}} = async (id) => {
  return await {{moduleName}}Model.remove(id);
};

