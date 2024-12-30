import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { getUser, updateUser } from "../controllers/userController";

const router = Router();

router.get("/:userId", authenticate, getUser); // Fetch user by userId
router.put("/:userId", authenticate, updateUser); // Update user profile (general)

export default router;
