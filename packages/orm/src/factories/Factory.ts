import { faker } from '@faker-js/faker';
import type { XModel } from '../XModel';

type DefinitionFn<T> = () => Promise<Partial<T>> | Partial<T>;

class FactoryBuilder {
  constructor(private count: number) {}

  /**
   * Create `count` instances of a model using the provided definition function.
   *
   * @example
   * await Factory.times(10).create(User, () => ({
   *   name: Factory.faker.person.fullName(),
   *   email: Factory.faker.internet.email(),
   * }));
   */
  async create<T extends XModel>(
    ModelClass: typeof XModel & { create(data: Partial<T>): Promise<T> },
    definition: DefinitionFn<T>
  ): Promise<T[]> {
    const results: T[] = [];
    for (let i = 0; i < this.count; i++) {
      const data = await definition();
      const instance = await ModelClass.create(data as Partial<T>);
      results.push(instance as T);
    }
    return results;
  }

  /**
   * Build plain objects without persisting to DB.
   * Useful for unit tests that don't need a DB.
   */
  async build<T>(definition: DefinitionFn<T>): Promise<T[]> {
    const results: T[] = [];
    for (let i = 0; i < this.count; i++) {
      results.push((await definition()) as T);
    }
    return results;
  }
}

export class Factory {
  /** Access Faker directly: Factory.faker.person.fullName() */
  static faker = faker;

  static times(count: number): FactoryBuilder {
    return new FactoryBuilder(count);
  }

  /** Shorthand for Factory.times(1).create(...) */
  static async create<T extends XModel>(
    ModelClass: typeof XModel & { create(data: Partial<T>): Promise<T> },
    definition: DefinitionFn<T>
  ): Promise<T> {
    const [result] = await Factory.times(1).create(ModelClass, definition);
    return result!;
  }
}
