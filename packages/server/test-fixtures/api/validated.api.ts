import { XRouter } from "@xacos/core";
import { v } from "@xacos/validation";

export const router = new XRouter();

router.post(
  "/",
  {
    schema: {
      body: v.object({
        name: v.string().min(2),
      }),
    },
  },
  async (req, res) => {
    const body = req.body as { name: string };
    res.status(201).json({ name: body.name });
  },
);

