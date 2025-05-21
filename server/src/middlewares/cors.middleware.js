// athStock/web/server/src/middlewares/cors.middleware.js

import cors from "cors";

const whitelist = ["https://athstock.io.vn", "http://localhost:5174"];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (whitelist.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content",
    "Accept",
    "Content-Type",
    "Authorization",
  ],
};

export default cors(corsOptions);
