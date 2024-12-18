import * as functions from "firebase-functions";
import * as express from "express";
import * as cors from "cors";
import "./config/firebase-config";
import routes from "./routes";

const app = express();
app.use(cors());
app.use(express.json());

// Routes example

app.use("/", routes);

// Health Check
app.get("/", (req, res) => {
  res.send("CalTrack Backend API is running!");
});

// Export the Express app as a Firebase Function
export const api = functions.https.onRequest(app);
