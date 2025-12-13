import { I{{ModuleName}}, ICreate{{ModuleName}}, IUpdate{{ModuleName}} } from "../interfaces/{{moduleName}}.interface.{{ext}}";

// In-memory storage (replace with actual database)
let {{moduleName}}s: I{{ModuleName}}[] = [];
let nextId = 1;

export const findAll = async (): Promise<I{{ModuleName}}[]> => {
  return {{moduleName}}s;
};

export const findById = async (id: string | number): Promise<I{{ModuleName}} | null> => {
  return {{moduleName}}s.find((item) => item.id === id) || null;
};

export const create = async (data: ICreate{{ModuleName}}): Promise<I{{ModuleName}}> => {
  const new{{ModuleName}}: I{{ModuleName}} = {
    id: nextId++,
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  {{moduleName}}s.push(new{{ModuleName}});
  return new{{ModuleName}};
};

export const update = async (id: string | number, data: IUpdate{{ModuleName}}): Promise<I{{ModuleName}} | null> => {
  const index = {{moduleName}}s.findIndex((item) => item.id === id);
  if (index === -1) return null;
  {{moduleName}}s[index] = {
    ...{{moduleName}}s[index],
    ...data,
    updatedAt: new Date(),
  };
  return {{moduleName}}s[index];
};

export const remove = async (id: string | number): Promise<I{{ModuleName}} | null> => {
  const index = {{moduleName}}s.findIndex((item) => item.id === id);
  if (index === -1) return null;
  return {{moduleName}}s.splice(index, 1)[0];
};

