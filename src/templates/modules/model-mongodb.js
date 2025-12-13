import mongoose from "mongoose";

const {{ModuleName}}Schema = new mongoose.Schema(
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

export const {{ModuleName}} = mongoose.model("{{ModuleName}}", {{ModuleName}}Schema);

export const findAll = async () => {
  return await {{ModuleName}}.find();
};

export const findById = async (id) => {
  return await {{ModuleName}}.findById(id);
};

export const create = async (data) => {
  return await {{ModuleName}}.create(data);
};

export const update = async (id, data) => {
  return await {{ModuleName}}.findByIdAndUpdate(id, data, { new: true });
};

export const remove = async (id) => {
  return await {{ModuleName}}.findByIdAndDelete(id);
};

