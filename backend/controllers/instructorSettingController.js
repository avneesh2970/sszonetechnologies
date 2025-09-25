const InstructorProfile = require("../models/InstructorSettingModel");
const Instructor = require("../models/instructorModel")


const updateProfile = async (req, res) => {
  try {
    const updateData = req.body; // may contain profile or social fields

    let profile = await InstructorProfile.findOne({ instructor: req.instructorId });

    if (!profile) {
      // Create new profile with instructor reference
      profile = new InstructorProfile({ instructor: req.instructorId });
    }

    // Merge only provided fields into the existing profile
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined && updateData[key] !== "") {
        profile[key] = updateData[key];
      }
    });

    await profile.save();

    const populatedProfile = await InstructorProfile.findById(profile._id).populate(
      "instructor",
      "name email"
    );

    res.json({
      message: "Profile updated successfully",
      profile: populatedProfile,
    });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Server error" });
  }
};



const getProfile = async (req, res) => {
  try {
    const profile = await InstructorProfile.findOne({ instructor: req.instructorId })
      .populate("instructor",  "name email" , ); // show email too

    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { updateProfile, getProfile };
