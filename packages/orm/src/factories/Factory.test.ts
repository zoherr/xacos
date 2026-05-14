import { describe, it, expect } from 'bun:test';
import { Factory } from './Factory';

describe('Factory', () => {
  it('builds N plain objects', async () => {
    const items = await Factory.times(3).build(() => ({
      name: Factory.faker.person.fullName(),
    }));
    expect(items).toHaveLength(3);
    expect(typeof items[0]?.name).toBe('string');
  });

  it('times(0) returns empty array', async () => {
    const items = await Factory.times(0).build(() => ({ x: 1 }));
    expect(items).toHaveLength(0);
  });
});
