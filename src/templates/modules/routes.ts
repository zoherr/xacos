import { Router } from "express";
import * as controller from "../controllers/{{moduleName}}.controller";

const router = Router();

router.get("/", controller.get{{ModuleName}}s);
router.get("/:id", controller.get{{ModuleName}}ById);
router.post("/", controller.create{{ModuleName}});
router.put("/:id", controller.update{{ModuleName}});
router.delete("/:id", controller.delete{{ModuleName}});

export default router;

