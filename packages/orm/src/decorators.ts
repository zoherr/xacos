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

type WithRelations = { __xacosRelations?: RelationMeta[] };
type WithColumns = { __xacosColumns?: Map<string, ColumnOptions> };

type StandardDecoratorContext = {
  kind: string;
  name: string | symbol;
  addInitializer?: (initializer: () => void) => void;
};

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

function isStandardDecoratorContext(value: unknown): value is StandardDecoratorContext {
  return (
    typeof value === "object" &&
    value !== null &&
    "kind" in value &&
    "name" in value
  );
}

function pushRelation(constructor: object, meta: RelationMeta): void {
  const ctor = constructor as WithRelations;
  if (!ctor.__xacosRelations) ctor.__xacosRelations = [];
  ctor.__xacosRelations.push(meta);
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
  if (!ctor.__xacosColumns) ctor.__xacosColumns = new Map();
  return ctor.__xacosColumns;
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
  return (targetOrInitialValue: object | undefined, propertyKeyOrContext: string | symbol | StandardDecoratorContext): void => {
    if (isStandardDecoratorContext(propertyKeyOrContext)) {
      const context = propertyKeyOrContext;
      if (context.kind !== "field" && context.kind !== "accessor") {
        return;
      }

      const key = String(context.name);
      context.addInitializer?.(function (this: object) {
        const ctor = constructorFromTarget(this);
        ensureColumnMap(ctor).set(key, options);
      });
      return;
    }

    const key = String(propertyKeyOrContext);
    const ctor = constructorFromTarget(targetOrInitialValue);
    ensureColumnMap(ctor).set(key, options);
  };
}

export function getColumnOptions(constructor: object, propertyKey: string): ColumnOptions | undefined {
  let current: object | null = constructor;
  while (current) {
    const map = (current as WithColumns).__xacosColumns;
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
    const own = (current as WithRelations).__xacosRelations ?? [];
    collected.push(...own);
    current = Object.getPrototypeOf(current);
  }
  return collected;
}

