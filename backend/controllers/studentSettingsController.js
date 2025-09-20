const Settings = require("../models/studentSettingModel");
const User = require("../models/authModel");

// Create or Update settings
exports.upsertSettings = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const {
      firstName,
      lastName,
      username,
      phone,
      occupation,
      displayName,
      bio,
      facebook,
      instagram,
      twitter,
      linkedin,
      website,
      github,
    } = req.body;

    let settings = await Settings.findOne({ user: userId });

    if (settings) {
      // update existing
      settings.set({
        firstName,
        lastName,
        username,
        phone,
        occupation,
        displayName,
        bio,
        facebook,
        instagram,
        twitter,
        linkedin,
        website,
        github,
      });
      await settings.save();
    } else {
      // create new
      let settingsM = await Settings.create({
        firstName,
        lastName,
        username,
        phone,
        occupation,
        displayName,
        bio,
        facebook,
        instagram,
        twitter,
        linkedin,
        website,
        github,
        user: userId,
      });

      await User.findByIdAndUpdate(userId, { settings: settingsM._id });
    }

    res.status(200).json({ success: true, settings });
  } catch (err) {
    console.error("Error in upsertSettings:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// Get logged-in user settings
exports.getMySettings = async (req, res) => {
  try {
    const userId = req.user.id;

    const settings = await Settings.findOne({ user: userId });

    if (!settings) {
      return res
        .status(404)
        .json({ success: false, message: "Settings not found" });
    }

    res.status(200).json({ success: true, settings });
  } catch (err) {
    console.error("Error in getMySettings:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
