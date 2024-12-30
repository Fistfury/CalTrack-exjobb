import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { updateWeight } from "../controllers/weightController";

const router = Router();

router.put("/", authenticate, updateWeight); // Update weight for the logged-in user

export default router;
