import { XRouter } from "@xacos/core";

export const router = new XRouter();

router.get("/", async (_req, res) => {
  res.json({ ok: true });
});

