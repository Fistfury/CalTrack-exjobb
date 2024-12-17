import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./config/firebase-config";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Routes
import routes from "./routes";
app.use("/api", routes);

// Health Check Route
app.get("/", (req, res) => {
  res.send("CalTrack Backend API is running!");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
