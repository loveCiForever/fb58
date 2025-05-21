// ./server/src/routes/auth.route.js

import express from "express";
import {
  signin,
  signout,
  signup,
  oauth,
  getUserInfo,
  signUp,
  signIn,
  getProfile,
} from "../controllers/auth.controller.js";

import { verifyJWT } from "../middlewares/verify-jwt.middleware.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = new express.Router();

// Public routes
router.post("/signup", signUp);
router.post("/signin", signIn);

// Protected routes
router.get("/profile", isAuthenticated, getProfile);

router.post("/signout", verifyJWT, signout);
router.post("/oauth", oauth);
router.post("/get-user-info", verifyJWT, getUserInfo);

export default router;
