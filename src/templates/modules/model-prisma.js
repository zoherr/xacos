import { prisma } from "../config/db.{{ext}}";

export const findAll = async () => {
  return await prisma.{{moduleName}}.findMany();
};

export const findById = async (id) => {
  return await prisma.{{moduleName}}.findUnique({
    where: { id: parseInt(id) },
  });
};

export const create = async (data) => {
  return await prisma.{{moduleName}}.create({
    data,
  });
};

export const update = async (id, data) => {
  return await prisma.{{moduleName}}.update({
    where: { id: parseInt(id) },
    data,
  });
};

export const remove = async (id) => {
  return await prisma.{{moduleName}}.delete({
    where: { id: parseInt(id) },
  });
};

