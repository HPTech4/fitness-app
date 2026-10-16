// routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validate");
const { registerSchema, loginSchema } = require("../validators/authValidator");
const { logEvent } = require("../middlewares/securityLogger");

const router = express.Router();

// REGISTER
router.post("/register", validate(registerSchema), async (req, res) => {
  const { name, email, password } = req.body;

  try {
    logEvent("REGISTER_ATTEMPT", { ip: req.ip, email });

    // 1. Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logEvent("REGISTER_FAILED", {
        ip: req.ip,
        email,
        reason: "already_exists",
      });
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // 4. Generate JWT
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    logEvent("REGISTER_SUCCESS", {
      ip: req.ip,
      email,
      userId: newUser._id.toString(),
    });

    res.status(201).json({
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
router.post("/login", validate(loginSchema), async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) {
      logEvent("LOGIN_FAILED", {
        ip: req.ip,
        email,
        reason: "user_not_found",
      });
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logEvent("LOGIN_FAILED", {
        ip: req.ip,
        email,
        reason: "wrong_password",
      });
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 3. Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    logEvent("LOGIN_SUCCESS", {
      ip: req.ip,
      email,
      userId: user._id.toString(),
    });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/auth/me — current user
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/auth/me — update profile
router.patch("/me", auth, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim().length < 2) {
      return res
        .status(400)
        .json({ message: "Name must be at least 2 characters" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name: name.trim() },
      { new: true, runValidators: true },
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
