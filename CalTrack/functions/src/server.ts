import functions from "firebase-functions";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
import routes from "./routes";
app.use("/api", routes);

// Health Check Route
app.get("/", (req, res) => {
  res.send("CalTrack Backend API is running!");
});

// Export the Express app as a Firebase Function
export const api = functions.https.onRequest(app);
