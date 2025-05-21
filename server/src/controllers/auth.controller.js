// ./server/src/controller/auth.controller.js

import {
  genUserName,
  hashPassword,
  comparePassword,
  genCookieToken,
} from "../utils/helper-function.utils.js";

import {
  signInValidation,
  signUpValidation,
  oauthValidation,
} from "../services/auth.service.js";

import { verifyJWT } from "../middlewares/verify-jwt.middleware.js";

import Users from "../models/user.model.js";
import "dotenv/config";
import jwt from "jsonwebtoken";

const signup = async (req, res) => {
  try {
    const { full_name, email, password, navigateToHome } = req.body;

    /*
     * Read the general structure of error response at athStock/server/src/services/auth.service.js
     */
    const { error } = signUpValidation.validate({
      full_name,
      email,
      password,
    });

    // console.log("[SIGN UP] ", error);

    if (error) {
      if (error.details[0].path[0] == "full_name") {
        return res.status(400).json({
          success: false,
          message: "Invalid name",
          error: error.details[0].message,
        });
      } else if (error.details[0].path[0] == "password") {
        return res.status(400).json({
          success: false,
          message: "Invalid password",
          error: error.details[0].message,
        });
      } else if (error.details[0].path[0] == "email") {
        return res.status(400).json({
          success: false,
          message: "Invalid email",
          error: error.details[0].message,
        });
      }
      return;
    }

    const isEmailNotUnique = await Users.exists({
      "personal_info.email": email,
    });

    if (isEmailNotUnique) {
      return res.status(400).json({
        success: false,
        message: "User registration failed",
        error: "Email is already taken",
      });
    }

    const [hashedPassword, user_name] = await Promise.all([
      hashPassword(password),
      genUserName(email),
    ]);

    const user = await Users({
      personal_info: {
        full_name,
        user_name,
        email,
        password: hashedPassword,
      },
      isSignedIn: navigateToHome,
    }).save();

    const access_token = genCookieToken(user._id, res);
    const userToSend = {
      full_name: user.personal_info.full_name,
      user_name: user.personal_info.user_name,
      email: user.personal_info.email,
      profile_img: user.personal_info.profile_img,
      isSignedIn: navigateToHome,
      access_token,
    };

    // console.log("[SIGN UP] ", userToSend);

    res.status(202).json({
      success: true,
      message: "User has successfully registered",
      data: { user: userToSend },
    });
  } catch (error) {
    // console.log("[SIGN UP] ", error);
    res.status(500).json({
      success: false,
      message: "Hehehe you are getting some trouble with your backend code",
      error: error,
    });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    /*
     * Read the general structure of error response at athStock/server/src/services/auth.service.js
     */
    const { error } = signInValidation.validate({ email, password });
    // console.log(`[SIGN IN] signInValidation: ${error ? error : "ok"}`);

    if (error) {
      if (error.details[0].path[0] == "password") {
        return res.status(400).json({
          success: false,
          message: "Invalid password",
          error: error.details[0].message,
        });
      } else if (error.details[0].path[0] == "email") {
        return res.status(400).json({
          success: false,
          message: "Invalid email",
          error: error.details[0].message,
        });
      }
    }

    const user = await Users.findOne({ "personal_info.email": email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User sign in failed",
        error: "Email is not found",
      });
    }

    // console.log(`[SIGN IN] ${user} isSignedIn: ${user.isSignedIn} `);

    if (user.isSignedIn) {
      return res.status(409).json({
        success: false,
        message: "User sign in failed",
        error: "You account is signed in at another place",
      });
    }

    const isPasswordMatch = await comparePassword(
      password,
      user.personal_info.password
    );

    if (!isPasswordMatch) {
      return res.status(403).json({
        success: false,
        message: "User sign in failed",
        error: "Password is not correct",
      });
    }

    user.isSignedIn = true;
    await user.save();

    const access_token = genCookieToken(user._id, res);
    const userToSend = {
      full_name: user.personal_info.full_name,
      user_name: user.personal_info.user_name,
      email: user.personal_info.email,
      profile_img: user.personal_info.profile_img,
      isSignedIn: user.isSignedIn,
      access_token,
    };

    res.status(200).json({
      success: true,
      message: "User has successfully sign in",
      data: { user: userToSend },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Hehehe you are getting some trouble with your backend code",
      error: error.stack,
    });
  }
};

const signout = async (req, res) => {
  const user_id = req.user;
  console.log(user_id);

  try {
    res.clearCookie("blogToken");

    const user = await Users.findById(user_id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User sign out failed",
        error: "Email is not found",
      });
    }

    if (!user.isSignedIn) {
      return res.status(404).json({
        success: false,
        message: "User sign out failed",
        error: "User has not sign in yet",
      });
    }

    user.isSignedIn = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Sign out successfully",
      data: null,
    });
  } catch (error) {
    console.log("Sign out error: ", error);
    res.status(500).json({
      success: false,
      message: "Hehehe you are getting some trouble with your backend code",
      error: error,
    });
  }
};

const getUserInfo = async (req, res) => {
  const user_id = req.user;
  try {
    const user = await Users.findById(user_id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Get user information failed",
        error: "Email is not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Get user information successfully",
      data: { user: user },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Hehehe you are getting some trouble with your backend code",
      error: error,
    });
  }
};

const oauth = async (req, res) => {
  try {
    const { full_name, email, profile_img } = req.body;
    const { error } = oauthValidation.validate({
      full_name,
      email,
      profile_img,
    });

    if (error)
      return res.formatter.badRequest({
        message: "Oauth validation error",
        error: error,
      });

    const isUserExists = await Users.findOne({ "personal_info.email": email });
    if (!isUserExists) {
      const user_name = await genUserName(email);
      const user = await Users({
        personal_info: {
          full_name,
          email,
          profile_img: profile_img,
          user_name,
        },
        google_auth: true,
      }).save();
      const userToSend = {
        user_name: user.personal_info.user_name,
        email: user.personal_info.email,
        profile_img: user.personal_info.profile_img,
      };

      genCookieToken(user._id, res);
      return res.status(201).json(userToSend);
    } else if (isUserExists) {
      const userToSend = {
        user_name: isUserExists.personal_info.user_name,
        email: isUserExists.personal_info.email,
        profile_img: isUserExists.personal_info.profile_img,
      };
      genCookieToken(isUserExists._id, res);
      return res.status(201).json(userToSend);
    }

    res.status(404).json({ message: "Something went wrong" });
  } catch (error) {
    console.log("Error: on oauth => ", error.message);
    res
      .status(error.status || 500)
      .json({ message: error.message || "Internal server error" });
  }
};

export const signUp = async (req, res) => {
  try {
    // Validate request body
    const { error } = signUpValidation.validate(req.body);
    if (error) {
      return res.badRequest(error.details[0].message);
    }

    const { full_name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.badRequest("Email already registered");
    }

    // Create new user
    const user = new Users({
      full_name,
      email,
      password,
    });

    await user.save();

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.success("User registered successfully", {
      data: {
        user: {
          id: user._id,
          full_name: user.full_name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    }, 201);
  } catch (error) {
    res.error("Error registering user", error);
  }
};

export const signIn = async (req, res) => {
  try {
    // Validate request body
    const { error } = signInValidation.validate(req.body);
    if (error) {
      return res.badRequest(error.details[0].message);
    }

    const { email, password } = req.body;

    // Find user
    const user = await Users.findOne({ email });
    if (!user) {
      return res.unauthorized("Invalid email or password");
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.unauthorized("Invalid email or password");
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.success("User signed in successfully", {
      data: {
        user: {
          id: user._id,
          full_name: user.full_name,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error) {
    res.error("Error signing in", error);
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await Users.findById(req.user._id).select("-password");
    res.success("User profile retrieved successfully", {
      data: user,
    });
  } catch (error) {
    res.error("Error retrieving user profile", error);
  }
};

export { signup, signin, signout, oauth, getUserInfo };
