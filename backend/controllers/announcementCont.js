const Announcement = require("../models/announcementModel");

// POST: Add announcement
const announcement = async (req, res) => {
  const { title, course, date, time } = req.body;

  if (!title || !course || !date || !time) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newAnnouncement = await Announcement.create({ title, course, date, time });
    res.status(201).json(newAnnouncement);
  } catch (error) {
    res.status(500).json({ message: 'Error creating announcement', error });
  }
};

// GET: Fetch all announcements
const getAnnouncement = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching announcements', error });
  }
};

// PUT: Update announcement by ID
const updateAnnouncement = async (req, res) => {
  const { id } = req.params;
  const { title, course, date, time } = req.body;

  if (!title || !course || !date || !time) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const updated = await Announcement.findByIdAndUpdate(
      id,
      { title, course, date, time },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating announcement', error });
  }
};

// DELETE: Remove announcement by ID
const deleteAnnouncement = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Announcement.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.status(200).json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting announcement', error });
  }
};



module.exports = {
  announcement,
  getAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
};
