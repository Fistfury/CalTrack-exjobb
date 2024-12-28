import { Router } from "express";
import authRoutes from "./authRoutes";
import entryRoutes from "./entryRoutes";
import userRoutes from "./userRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/entries", entryRoutes);
router.use("/users", userRoutes);

router.get("/test", (req, res) => {
  res.send({ message: "Test route working!" });
});

export default router;
