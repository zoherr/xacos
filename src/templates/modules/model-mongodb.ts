import mongoose, { Document, Schema } from "mongoose";
import { I{{ModuleName}}, ICreate{{ModuleName}}, IUpdate{{ModuleName}} } from "../interfaces/{{moduleName}}.interface";

export interface I{{ModuleName}}Document extends I{{ModuleName}}, Document {}

const {{ModuleName}}Schema = new Schema<I{{ModuleName}}Document>(
  {
    name: {
      type: String,
      required: true,
    },
    // Add more fields as needed
  },
  {
    timestamps: true,
  }
);

export const {{ModuleName}} = mongoose.model<I{{ModuleName}}Document>("{{ModuleName}}", {{ModuleName}}Schema);

export const findAll = async (): Promise<I{{ModuleName}}[]> => {
  return await {{ModuleName}}.find();
};

export const findById = async (id: string): Promise<I{{ModuleName}} | null> => {
  return await {{ModuleName}}.findById(id);
};

export const create = async (data: ICreate{{ModuleName}}): Promise<I{{ModuleName}}> => {
  return await {{ModuleName}}.create(data);
};

export const update = async (id: string, data: IUpdate{{ModuleName}}): Promise<I{{ModuleName}} | null> => {
  return await {{ModuleName}}.findByIdAndUpdate(id, data, { new: true });
};

export const remove = async (id: string): Promise<I{{ModuleName}} | null> => {
  return await {{ModuleName}}.findByIdAndDelete(id);
};

