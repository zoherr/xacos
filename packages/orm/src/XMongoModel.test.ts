import { describe, expect, it } from "bun:test";
import { Schema } from "mongoose";
import { XMongoModel } from "./XMongoModel";

class MissingModelName extends XMongoModel {
  static getSchema(): Schema {
    return new Schema({ label: { type: String } });
  }
}

describe("XMongoModel", () => {
  it("requires modelName before accessing model", () => {
    expect(() => MissingModelName.model).toThrow("modelName");
  });
});
