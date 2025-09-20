const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/authModel");
const auth = require("../middleware/auth");
const sendEmail = require("../middleware/sendEmail");

const router = express.Router();

// 🔹 Helper to create token
const createToken = (user) => {
  return jwt.sign(
    { email: user.email, id: user._id, role: user.role || "USER" },
    process.env.JWT_SECRET,
    { expiresIn: "7d" } // longer expiration, since it's cookie-based
  );
};

// 🔹 Signup
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "USER",
    });

    const token = createToken(newUser);

    // Store token in cookie (instead of sending in body)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true on Render
      // sameSite: "none",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ message: "Signup successful", user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// 🔹 Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = createToken(existingUser);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true on Render
      // sameSite: "none",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login successful", user: existingUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// 🔹 Logout (clear cookie)
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
});

// Example protected route
router.get("/secure-data", auth, async (req, res) => {
  res.json({ message: `Hello ${req.user.email}` });
});

// auth.js route
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

// Verify Old Password
router.post("/verify-old-password", auth, async (req, res) => {
  const { oldPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    res.status(200).json({ message: "Old password verified" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Update New Password
router.put("/update-password", auth, async (req, res) => {
  const { newPassword, confirmPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New passwords do not match" });
    }

    const isSameAsOld = await bcrypt.compare(newPassword, user.password);
    if (isSameAsOld) {
      return res
        .status(400)
        .json({ message: "New password cannot be same as old password" });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Request OTP
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate 6 digit otp
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP with expiry in 5 min
    user.resetOTP = otp;
    user.resetOTPExpire = Date.now() + 5 * 60 * 1000;
    await user.save();

    // Send Otp via email
    await sendEmail(
      user.email,
      "Password Reset OTP",
      `Your OTP IS ${otp}, It will expire in 5 minutes`
    );
    res.status(200).json({ message: `OTP sent to email ,  ${otp}` ,  });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong", err});
  }
});

// Verify OTP
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({
      email,
      resetOTP: otp,
      resetOTPExpire: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired OTP" });

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});


// Reset password
router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword, confirmPassword } = req.body;
  try {
    const user = await User.findOne({
      email,
      resetOTP: otp,
      resetOTPExpire: { $gt: Date.now() },
    });
    if (!user)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    user.resetOTP = undefined;
    user.resetOTPExpire = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" + err });
  }
});


// Get all users
router.get("/all", async (req, res) => {
  try {
    const allUser = await User.find(); // fetch all users from DB
    res.status(200).json({
      success: true,
      users: allUser,
      message: "All users fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
});


module.exports = router;
