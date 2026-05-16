import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { registerColumnMeta, registerRelation } from "./decorators";
import { closeDb, getKnex, initDb } from "./index";
import { XModel } from "./XModel";

class Post extends XModel {
  static override table = "posts";
}

class User extends XModel {
  static override table = "users";
  posts?: unknown;
}

registerRelation(User, {
  kind: "hasMany",
  related: () => Post,
  foreignKey: "user_id",
  propertyKey: "posts",
});

class UserSoft extends XModel {
  static override table = "users";
  static override softDeletes = true;
}

class Profile extends XModel {
  static override table = "profiles";
  secret?: string;
}

registerColumnMeta(Profile, "secret", { hidden: true });

describe("XModel", () => {
  beforeAll(async () => {
    initDb({ __memorySqlite: true });
    const knex = getKnex();

    await knex.schema.dropTableIfExists("posts");
    await knex.schema.dropTableIfExists("profiles");
    await knex.schema.dropTableIfExists("users");

    await knex.schema.createTable("users", (table) => {
      table.increments("id").primary();
      table.string("name", 255).notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
      table.timestamp("deleted_at").nullable();
    });

    await knex.schema.createTable("posts", (table) => {
      table.increments("id").primary();
      table.integer("user_id").unsigned().notNullable();
      table.string("title", 255).notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    });

    await knex.schema.createTable("profiles", (table) => {
      table.increments("id").primary();
      table.string("secret", 255).notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
  });

  afterAll(async () => {
    await closeDb();
  });

  it("creates, finds, and lists rows", async () => {
    const created = await User.create({ name: "alice" });
    expect(created.name).toBe("alice");

    const found = await User.find(created.id as number);
    expect(found?.name).toBe("alice");

    const all = await User.all();
    expect(all.length).toBeGreaterThan(0);
  });

  it("throws findOrFail when missing", async () => {
    await expect(User.findOrFail(9_007_199_254_740_991)).rejects.toThrow("Not found");
  });

  it("supports where filters", async () => {
    const rows = await User.where("name", "alice").select();
    expect(rows.length).toBeGreaterThan(0);
  });

  it("updates rows via static update and instance save", async () => {
    const created = await User.create({ name: "bob" });
    await User.update(created.id as number, { name: "bobby" });
    const updated = await User.find(created.id as number);
    expect(updated?.name).toBe("bobby");

    const instance = Object.assign(new User(), updated);
    await instance.save();
    const reloaded = await User.find(created.id as number);
    expect(reloaded?.name).toBe("bobby");
  });

  it("destroys rows", async () => {
    const created = await User.create({ name: "tmp" });
    await User.destroy(created.id as number);
    expect(await User.find(created.id as number)).toBeNull();
  });

  it("paginates with the shared envelope shape", async () => {
    const page = await User.paginate(1, 5);
    expect(page.data.length).toBeGreaterThan(0);
    expect(page.total).toBeGreaterThan(0);
    expect(page.page).toBe(1);
    expect(page.perPage).toBe(5);
    expect(page.lastPage).toBeGreaterThan(0);
  });

  it("eager-loads hasMany relations", async () => {
    const unique = `owner-${Math.random().toString(16).slice(2)}`;
    const owner = await User.create({ name: unique });
    await Post.create({ user_id: owner.id, title: "hello" });

    const rows = await User.with("posts").where("name", unique).get();
    expect(rows[0]?.posts).toBeDefined();
    expect(Array.isArray(rows[0]?.posts)).toBe(true);
    expect((rows[0]?.posts as { title: string }[])[0]?.title).toBe("hello");
  });

  it("applies soft deletes", async () => {
    const created = await UserSoft.create({ name: "ghost" });
    const instance = Object.assign(new UserSoft(), created);
    await instance.delete();

    expect(await UserSoft.find(created.id as number)).toBeNull();
    const trashed = await UserSoft.withTrashed().where("id", created.id as number).first();
    expect(trashed).not.toBeNull();
  });

  it("strips hidden columns from toJSON", async () => {
    const created = await Profile.create({ secret: "hide-me" });
    const instance = Object.assign(new Profile(), created);
    const json = instance.toJSON();
    expect(json.secret).toBeUndefined();
    expect(json.id).toBeDefined();
  });
});

