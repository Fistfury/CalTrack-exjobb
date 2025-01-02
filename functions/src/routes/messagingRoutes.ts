import express from "express";
import { authenticate } from "../middlewares/authenticate";
import { saveFcmToken } from "../controllers/messagingController";

const router = express.Router();

router.post("/save-fcm-token", authenticate, saveFcmToken);

export default router;
