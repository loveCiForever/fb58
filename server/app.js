// app.js

import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

import ConnectDatabase from "./src/configs/database.js";
import corsMiddleware from "./src/middlewares/cors.middleware.js";
import responseFormatter from "./src/middlewares/response.middleware.js";

import authRoute from "./src/routes/auth.route.js";
import fieldRoute from "./src/routes/field.route.js";
import bookingRoute from "./src/routes/booking.route.js";
import supportRoute from "./src/routes/support.route.js";
import reportRoute from "./src/routes/report.route.js";

const app = express();
const port = process.env.PORT || 8000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(cookieParser());
app.use(corsMiddleware);
app.use(responseFormatter);

// Routes
app.use("/api/auth", authRoute);
app.use("/api/fields", fieldRoute);
app.use("/api/bookings", bookingRoute);
app.use("/api/support", supportRoute);
app.use("/api/reports", reportRoute);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, async () => {
  ConnectDatabase();
  console.log(`[APP.js] Server is running on port ${port}`);
});
