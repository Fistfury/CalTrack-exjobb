import { Router } from "express";
import { registerUser, loginUser } from "../controllers/authController";
import { validate } from "../middlewares/validate";
import { userLoginSchema } from "../schemas/userSchema";

const router = Router();

router.post("/register", registerUser);
router.post("/login", validate(userLoginSchema), loginUser);

export default router;
