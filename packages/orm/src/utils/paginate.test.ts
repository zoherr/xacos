import { describe, expect, it } from "bun:test";
import { paginate } from "./paginate";

describe("paginate", () => {
  it("caps perPage at 100 and ensures page is at least 1", async () => {
    const mockQuery = {
      clone: () => mockQuery,
      clearOrder: () => mockQuery,
      clearSelect: () => mockQuery,
      count: () => mockQuery,
      first: async () => ({ total: 50 }),
      offset: (off: number) => ({
        limit: async (lim: number) => [{ id: 1, off, lim }],
      }),
    };

    const res = await paginate(mockQuery as any, -5, 999);
    expect(res.page).toBe(1);
    expect(res.perPage).toBe(100);
    expect(res.total).toBe(50);
    expect(res.lastPage).toBe(1);
    expect(res.data).toEqual([{ id: 1, off: 0, lim: 100 }] as any);
  });
});
