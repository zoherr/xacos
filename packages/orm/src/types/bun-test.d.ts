declare module 'bun:test' {
  export function describe(name: string, fn: () => void): void;
  export function it(name: string, fn: () => Promise<void> | void): void;
  export function expect(value: any): any;
  export function beforeAll(fn: () => Promise<void> | void): void;
  export function afterAll(fn: () => Promise<void> | void): void;
}

