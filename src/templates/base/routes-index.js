import { Router } from "express";

const router = Router();

// Import routes here
// import userRoutes from "./user.routes.{{ext}}";
// router.use("/users", userRoutes);

router.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

export default router;

