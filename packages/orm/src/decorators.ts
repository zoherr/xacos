export type ModelConstructor = { new (...args: never[]): unknown; readonly table: string };

export type RelationMeta =
  | Readonly<{
      kind: "hasMany";
      related: () => ModelConstructor;
      foreignKey: string;
      propertyKey: string;
    }>
  | Readonly<{
      kind: "belongsTo";
      related: () => ModelConstructor;
      foreignKey: string;
      propertyKey: string;
    }>
  | Readonly<{
      kind: "hasOne";
      related: () => ModelConstructor;
      foreignKey: string;
      propertyKey: string;
    }>
  | Readonly<{
      kind: "belongsToMany";
      related: () => ModelConstructor;
      pivotTable: string;
      propertyKey: string;
    }>;

export type ColumnOptions = Readonly<{
  hidden?: boolean;
  default?: unknown;
}>;

type WithRelations = { __xaocsRelations?: RelationMeta[] };
type WithColumns = { __xaocsColumns?: Map<string, ColumnOptions> };

function constructorFromTarget(target: object | undefined): object {
  if (!target || typeof target !== "object") {
    throw new Error("[XAOCS ORM] Decorators must be applied to class members with a valid prototype target");
  }
  const ctor = (target as { constructor?: object }).constructor;
  if (!ctor) {
    throw new Error("[XAOCS ORM] Decorators require a constructor on the decorated target");
  }
  return ctor;
}

function pushRelation(constructor: object, meta: RelationMeta): void {
  const ctor = constructor as WithRelations;
  if (!ctor.__xaocsRelations) ctor.__xaocsRelations = [];
  ctor.__xaocsRelations.push(meta);
}

/** Register relation metadata when runtime decorators receive no prototype (e.g. some Bun/TS field transforms). */
export function registerRelation(constructor: object, meta: RelationMeta): void {
  pushRelation(constructor, meta);
}

/** Register column metadata without a decorator. */
export function registerColumnMeta(constructor: object, propertyKey: string, options: ColumnOptions): void {
  ensureColumnMap(constructor).set(propertyKey, options);
}

function ensureColumnMap(constructor: object): Map<string, ColumnOptions> {
  const ctor = constructor as WithColumns;
  if (!ctor.__xaocsColumns) ctor.__xaocsColumns = new Map();
  return ctor.__xaocsColumns;
}

export function HasMany(related: () => ModelConstructor, foreignKey: string) {
  return (target: object | undefined, propertyKey: string | symbol): void => {
    const key = String(propertyKey);
    const ctor = constructorFromTarget(target);
    pushRelation(ctor, { kind: "hasMany", related, foreignKey, propertyKey: key });
  };
}

export function BelongsTo(related: () => ModelConstructor, foreignKey: string) {
  return (target: object | undefined, propertyKey: string | symbol): void => {
    const key = String(propertyKey);
    const ctor = constructorFromTarget(target);
    pushRelation(ctor, { kind: "belongsTo", related, foreignKey, propertyKey: key });
  };
}

export function HasOne(related: () => ModelConstructor, foreignKey: string) {
  return (target: object | undefined, propertyKey: string | symbol): void => {
    const key = String(propertyKey);
    const ctor = constructorFromTarget(target);
    pushRelation(ctor, { kind: "hasOne", related, foreignKey, propertyKey: key });
  };
}

export function BelongsToMany(related: () => ModelConstructor, pivotTable: string) {
  return (target: object | undefined, propertyKey: string | symbol): void => {
    const key = String(propertyKey);
    const ctor = constructorFromTarget(target);
    pushRelation(ctor, { kind: "belongsToMany", related, pivotTable, propertyKey: key });
  };
}

export function Column(options: ColumnOptions = {}) {
  return (target: object | undefined, propertyKey: string | symbol): void => {
    const key = String(propertyKey);
    const ctor = constructorFromTarget(target);
    ensureColumnMap(ctor).set(key, options);
  };
}

export function getColumnOptions(constructor: object, propertyKey: string): ColumnOptions | undefined {
  let current: object | null = constructor;
  while (current) {
    const map = (current as WithColumns).__xaocsColumns;
    const hit = map?.get(propertyKey);
    if (hit) return hit;
    current = Object.getPrototypeOf(current);
  }
  return undefined;
}

export function getRelations(ctor: object): RelationMeta[] {
  const collected: RelationMeta[] = [];
  let current: object | null = ctor;
  while (current) {
    const own = (current as WithRelations).__xaocsRelations ?? [];
    collected.push(...own);
    current = Object.getPrototypeOf(current);
  }
  return collected;
}
