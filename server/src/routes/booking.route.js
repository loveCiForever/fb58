import express from "express";
import {
    getAvailableShifts,
    createBooking,
    getUserBookings,
    cancelBooking,
    getAllBookings,
    confirmBooking,
    rejectBooking,
    getFieldShifts,
} from "../controllers/booking.controller.js";
import { isAdmin, isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/available-shifts", getAvailableShifts);
router.get("/field-shifts", getFieldShifts);

// User routes
router.use(isAuthenticated);
router.post("/", createBooking);
router.get("/user", getUserBookings);
router.put("/:id/cancel", cancelBooking);

// Admin routes
router.use(isAdmin);
router.get("/", getAllBookings);
router.put("/:id/confirm", confirmBooking);
router.put("/:id/reject", rejectBooking);

export default router; 