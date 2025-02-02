import * as functions from "firebase-functions";
import express from "express";
import cors from "cors";
import "./config/firebase-config";
import routes from "./routes";
import { sendDailyReminder } from "./config/dailyReminder";

const app = express();

// Middleware
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://caltrack-9b7b6.web.app"]
    : ["http://127.0.0.1:5173", "http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-user-id"],
    credentials: true,
  })
);

// Middleware för att hantera preflight OPTIONS-förfrågningar
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-user-id"
  );
  res.sendStatus(204);
});

app.use(express.json());

// Montera routes
app.use("/", routes);

// Exportera API-funktionen
export const api = functions.https.onRequest(app);

// Exportera Daily Reminder Function
export { sendDailyReminder };
