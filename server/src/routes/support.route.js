import express from "express";
import {
    createSupportRequest,
    getUserSupportRequests,
    getAllSupportRequests,
    updateSupportRequestStatus,
    addSupportRequestResponse,
} from "../controllers/support.controller.js";
import { isAdmin, isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

// User routes
router.use(isAuthenticated);
router.post("/", createSupportRequest);
router.get("/user", getUserSupportRequests);

// Admin routes
router.use(isAdmin);
router.get("/", getAllSupportRequests);
router.put("/:id/status", updateSupportRequestStatus);
router.post("/:id/response", addSupportRequestResponse);

export default router; 