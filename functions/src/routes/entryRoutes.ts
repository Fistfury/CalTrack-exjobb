import { Router } from "express";
import { createEntry, getEntries } from "../controllers/entryController";
import { authenticate } from "../middlewares/authenticate";
import { validate } from "../middlewares/validate";
import { entrySchema } from "../schemas/entrySchema";

const router = Router();

router.post("/", authenticate, validate(entrySchema), createEntry);
router.get("/:userId", authenticate, getEntries);
export default router;
