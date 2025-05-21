// athStock/server/src/middlewares/auth.js

import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Middleware to check if user is authenticated
export const isAuthenticated = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.unauthorized("No token provided");
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.unauthorized("User not found");
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.unauthorized("Invalid token");
    }
    if (error.name === "TokenExpiredError") {
      return res.unauthorized("Token expired");
    }
    res.error("Authentication error", error);
  }
};

// Middleware to check if user is admin
export const isAdmin = async (req, res, next) => {
  try {
    // Check if user exists and is admin
    if (!req.user || req.user.role !== "admin") {
      return res.forbidden("Not authorized to access this route");
    }
    next();
  } catch (error) {
    res.error("Authorization error", error);
  }
};
