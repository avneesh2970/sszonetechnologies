const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Instructor = require("../models/instructorModel");

// Signup Controller
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let existing = await Instructor.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Instructor already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newInstructor = new Instructor({
      name,
      email,
      password: hashedPassword,
    });
    await newInstructor.save();

    res.status(201).json({ message: "Instructor registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Login Controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Instructor.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "strict",
    //   maxAge: 24 * 60 * 60 * 1000,
    // });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true on Render
      // sameSite: "none",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Login successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Check Old Password
const checkPassword = async (req, res) => {
  try {
    const { oldPassword } = req.body;
    const user = await Instructor.findById(req.instructorId);

    if (!user) return res.status(404).json({ message: "Instructor not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Old password is incorrect" });

    res.json({ message: "Password verified" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update Password Controller
const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // check confirm
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New passwords do not match" });
    }

    // get logged-in instructor
    const user = await Instructor.findById(req.instructorId);
    if (!user) {
      return res.status(404).json({ message: "Instructor not found" });
    }

    // check old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    // hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Logout Controller
const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

// Profile Controller
const getProfile = async (req, res) => {
  try {
    const user = await Instructor.findById(req.instructorId).select(
      "-password"
    );
    if (!user) return res.status(404).json({ message: "Instructor not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  signup,
  login,
  logout,
  checkPassword,
  updatePassword,
  getProfile,
};
