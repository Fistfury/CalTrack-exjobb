import { Router } from "express";
import {
  getEntriesSummary,
  createOrUpdateEntry,
} from "../controllers/entryController";
import { authenticate } from "../middlewares/authenticate";
import { validate } from "../middlewares/validate";
import { entrySchema } from "../schemas/entrySchema";

const router = Router();

router.get("/summary", authenticate, getEntriesSummary); // Weekly summary
router.post("/", authenticate, validate(entrySchema), createOrUpdateEntry); // Full entry creation

export default router;
