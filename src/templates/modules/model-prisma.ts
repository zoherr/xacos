import { prisma } from "../config/db.{{ext}}";
import { I{{ModuleName}}, ICreate{{ModuleName}}, IUpdate{{ModuleName}} } from "../interfaces/{{moduleName}}.interface.{{ext}}";

export const findAll = async (): Promise<I{{ModuleName}}[]> => {
  return await prisma.{{moduleName}}.findMany();
};

export const findById = async (id: string | number): Promise<I{{ModuleName}} | null> => {
  return await prisma.{{moduleName}}.findUnique({
    where: { id: typeof id === "string" ? parseInt(id) : id },
  });
};

export const create = async (data: ICreate{{ModuleName}}): Promise<I{{ModuleName}}> => {
  return await prisma.{{moduleName}}.create({
    data,
  });
};

export const update = async (id: string | number, data: IUpdate{{ModuleName}}): Promise<I{{ModuleName}} | null> => {
  return await prisma.{{moduleName}}.update({
    where: { id: typeof id === "string" ? parseInt(id) : id },
    data,
  });
};

export const remove = async (id: string | number): Promise<I{{ModuleName}} | null> => {
  return await prisma.{{moduleName}}.delete({
    where: { id: typeof id === "string" ? parseInt(id) : id },
  });
};

