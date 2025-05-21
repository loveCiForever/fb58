import express from "express";
import {
    getAllFields,
    getFieldById,
    getAvailableTimeSlots,
    getBookedTimeSlotsByField,
    getBookedTimeSlotsByDate,
    createField,
    updateField,
    deleteField,
} from "../controllers/field.controller.js";
import { isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllFields);
router.get("/:id", getFieldById);
router.get("/:fieldId/available-slots/:date", getAvailableTimeSlots);
router.get("/booked-time-slots/:fieldId/:date", getBookedTimeSlotsByField);
router.get("/booked-time-slots/:date", getBookedTimeSlotsByDate);

// Admin routes
router.post("/", isAdmin, createField);
router.put("/:id", isAdmin, updateField);
router.delete("/:id", isAdmin, deleteField);

export default router; 