import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { getUserProfile } from "../controllers/weightController";
import { updateWeight } from "../controllers/userController";

const router = Router();

// Add routes for fetching and updating user profile
router.get("/:userId", authenticate, getUserProfile);
router.put("/weight", authenticate, updateWeight);

export default router;
