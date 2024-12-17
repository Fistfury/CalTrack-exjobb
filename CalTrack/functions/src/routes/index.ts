import { Router } from "express";
import authRoutes from "./authRoutes";
import entryRoutes from "./entryRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/entries", entryRoutes);

export default router;
