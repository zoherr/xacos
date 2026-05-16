import mongoose, {
  type FilterQuery,
  type Model,
  type Schema,
  type SortOrder,
  type UpdateQuery,
  Types,
} from "mongoose";
import type { PaginatedResult } from "@xacos/shared";

type MongoDoc = Record<string, unknown>;

/**
 * Mongoose-backed persistence. With MongoDB you define a {@link Schema} on the subclass
 * and use this API directly — **no Knex migrations** (`MigrationRunner` is SQL-only).
 */
export abstract class XMongoModel {
  /** Registered name for `mongoose.model()` (must be unique per connection). */
  static modelName = "";
  /** Optional Mongo collection name (passed to the schema via `collection` option). */
  static collection = "";

  static getSchema(): Schema {
    throw new Error("[XAOCS ORM] Override getSchema() and return a Mongoose Schema for this model.");
  }

  static get model(): Model<MongoDoc & mongoose.Document> {
    const ctor = this as typeof XMongoModel;
    if (!ctor.modelName) {
      throw new Error("[XAOCS ORM] static modelName is required on XMongoModel subclasses.");
    }

    const existing = mongoose.models[ctor.modelName] as Model<MongoDoc & mongoose.Document> | undefined;
    if (existing) {
      return existing;
    }

    const schema = ctor.getSchema();
    if (ctor.collection) {
      schema.set("collection", ctor.collection);
    }

    return mongoose.model<MongoDoc & mongoose.Document>(ctor.modelName, schema);
  }

  static async findById(id: string | Types.ObjectId): Promise<MongoDoc | null> {
    const doc = await this.model.findById(id).lean<MongoDoc>().exec();
    return doc ?? null;
  }

  static async findByIdOrFail(id: string | Types.ObjectId): Promise<MongoDoc> {
    const row = await this.findById(id);
    if (!row) {
      const err = new Error("Not found");
      (err as Error & { statusCode: number }).statusCode = 404;
      throw err;
    }
    return row;
  }

  static async findOne(filter: FilterQuery<MongoDoc>): Promise<MongoDoc | null> {
    const doc = await this.model.findOne(filter).lean<MongoDoc>().exec();
    return doc ?? null;
  }

  static async find(filter: FilterQuery<MongoDoc> = {}): Promise<MongoDoc[]> {
    return (await this.model.find(filter).lean<MongoDoc[]>().exec()) as MongoDoc[];
  }

  static async create(data: MongoDoc): Promise<MongoDoc> {
    const created = await this.model.create(data);
    const plain = created.toObject() as MongoDoc;
    const id = plain["_id"];
    if (id !== undefined) {
      plain["id"] = String(id);
    }
    return plain;
  }

  static async updateById(
    id: string | Types.ObjectId,
    update: UpdateQuery<MongoDoc>,
  ): Promise<MongoDoc | null> {
    const doc = await this.model
      .findByIdAndUpdate(id, update, { new: true, runValidators: true })
      .lean<MongoDoc>()
      .exec();
    return doc ?? null;
  }

  static async deleteById(id: string | Types.ObjectId): Promise<boolean> {
    const res = await this.model.findByIdAndDelete(id).exec();
    return res !== null;
  }

  static async paginate(
    filter: FilterQuery<MongoDoc> = {},
    page = 1,
    perPage = 15,
    sort: Record<string, SortOrder> = { _id: -1 },
  ): Promise<PaginatedResult<MongoDoc>> {
    const skip = (page - 1) * perPage;
    const [total, data] = await Promise.all([
      this.model.countDocuments(filter).exec(),
      this.model.find(filter).sort(sort).skip(skip).limit(perPage).lean<MongoDoc[]>().exec(),
    ]);
    const lastPage = Math.max(1, Math.ceil(total / perPage));
    return {
      data: data as MongoDoc[],
      total,
      page,
      perPage,
      lastPage,
    };
  }
}

export default XMongoModel;

