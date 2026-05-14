import { XRouter } from "@xaocs/core";

export const router = new XRouter();

router.get("/", async (_req, res) => {
  res.json({ ok: true });
});
