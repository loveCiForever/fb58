import express from "express";
import {
    generateRevenueReport,
    getDashboardStats,
} from "../controllers/report.controller.js";
import { isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Admin routes
router.use(isAdmin);
router.get("/revenue", generateRevenueReport);
router.get("/dashboard", getDashboardStats);

export default router; 