import { Router } from "express";
import {
  getEntries,
  getEntriesSummary,
  addEntry,
  createOrUpdateEntry,
} from "../controllers/entryController";
import { authenticate } from "../middlewares/authenticate";
import { validate } from "../middlewares/validate";
import { entrySchema } from "../schemas/entrySchema";

const router = Router();

router.get("/summary", authenticate, getEntriesSummary); // Weekly summary
router.get("/:userId", authenticate, getEntries); // Fetch entries for a user
router.post("/", authenticate, validate(entrySchema), createOrUpdateEntry); // Full entry creation
router.post("/add", authenticate, addEntry); // Add manual weight for a specific day

export default router;
