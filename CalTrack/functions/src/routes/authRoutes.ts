import { Router } from "express";
import { registerUser, loginUser } from "../controllers/authController";
import { validate } from "../middlewares/validate";
import { userLoginSchema, userRegistrationSchema } from "../schemas/userSchema";
import { authenticate } from "../middlewares/authenticate";

const router = Router();

router.post(
  "/register",
  authenticate,
  validate(userRegistrationSchema),
  registerUser
);
router.post("/login", authenticate, validate(userLoginSchema), loginUser);

export default router;
