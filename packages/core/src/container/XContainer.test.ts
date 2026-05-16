import { beforeEach, describe, expect, it } from "bun:test";
import { XContainer } from "./XContainer";

describe("XContainer", () => {
  let container: XContainer;

  beforeEach(() => {
    container = new XContainer();
  });

  it("binds and resolves a factory", () => {
    container.bind("Greeter", () => ({ greet: () => "hello" }));

    const greeter = container.make<{ greet: () => string }>("Greeter");

    expect(greeter.greet()).toBe("hello");
  });

  it("returns the same singleton instance", () => {
    let counter = 0;
    container.singleton("Counter", () => ({ id: ++counter }));

    const first = container.make<{ id: number }>("Counter");
    const second = container.make<{ id: number }>("Counter");

    expect(first.id).toBe(second.id);
    expect(counter).toBe(1);
  });

  it("throws when key is missing", () => {
    expect(() => container.make("Missing")).toThrow();
  });
});

