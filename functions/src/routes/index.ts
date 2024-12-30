import { Router } from "express";
import authRoutes from "./authRoutes";
import entryRoutes from "./entryRoutes";
import userRoutes from "./userRoutes";
import weightRoutes from "./weightRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/entries", entryRoutes);
router.use("/users", userRoutes);
router.use("/weight", weightRoutes);

router.get("/test", (req, res) => {
  res.send({ message: "Test route working!" });
});

export default router;
