// In-memory storage (replace with actual database)
let {{moduleName}}s = [];
let nextId = 1;

export const findAll = async () => {
  return {{moduleName}}s;
};

export const findById = async (id) => {
  return {{moduleName}}s.find((item) => item.id === id);
};

export const create = async (data) => {
  const new{{ModuleName}} = {
    id: nextId++,
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  {{moduleName}}s.push(new{{ModuleName}});
  return new{{ModuleName}};
};

export const update = async (id, data) => {
  const index = {{moduleName}}s.findIndex((item) => item.id === id);
  if (index === -1) return null;
  {{moduleName}}s[index] = {
    ...{{moduleName}}s[index],
    ...data,
    updatedAt: new Date(),
  };
  return {{moduleName}}s[index];
};

export const remove = async (id) => {
  const index = {{moduleName}}s.findIndex((item) => item.id === id);
  if (index === -1) return null;
  return {{moduleName}}s.splice(index, 1)[0];
};

