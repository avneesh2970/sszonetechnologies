const Admin = require('../models/adminModel')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



const loginAdminController = (async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingAdmin = await Admin.findOne({ email });
    if (!existingAdmin) return res.status(404).json({ message: 'admin not found' });

    const isPasswordCorrect = await bcrypt.compare(password, existingAdmin.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ email: existingAdmin.email, id: existingAdmin._id, role: "ADMIN" }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.status(200).json({ result: existingAdmin, token, role: "ADMIN" });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

const verifyPassword = async (req, res) => {
  try {
    const { oldPassword } = req.body;
    const adminId = req.user.id; // comes from authMiddleware

    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(404).json({ success: false, message: "Admin not found" });

    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Old password is incorrect" });

    res.status(200).json({ success: true, message: "Old password verified!" });
  } catch (error) {
    console.error("Error verifying password:", error);
    res.status(500).json({ success: false, message: "Server error while verifying password" });
  }
};

const updateAdminPassword = async (req, res) => {
 try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    const adminId = req.user.id; // comes from authMiddleware

    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(404).json({ success: false, message: "Admin not found" });

    // verify old password
    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) return res.status(400).json({ success: false, message: "Old password is incorrect" });

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: "New password and confirm password do not match" });
    }

    // hash and save
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    admin.password = hashedPassword;
    await admin.save();

    res.status(200).json({ success: true, message: "Password updated successfully!" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ success: false, message: "Server error while updating password" });
  }
};
module.exports = { loginAdminController ,verifyPassword, updateAdminPassword };

