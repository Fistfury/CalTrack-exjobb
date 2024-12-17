import { Router } from "express";
import {
  createMilestone,
  getMilestones,
  updateMilestone,
} from "../controllers/milestoneController";
import { validate } from "../middlewares/validate";
import { milestoneSchema } from "../schemas/milestoneSchema";

const router = Router();

// POST /milestones (Create a milestone)
router.post("/", validate(milestoneSchema), createMilestone);

// GET /milestones (Retrieve all milestones)
router.get("/", validate(milestoneSchema), getMilestones);

// PUT /milestones/:id (Update a specific milestone)
router.put("/:id", validate(milestoneSchema), updateMilestone);

export default router;
