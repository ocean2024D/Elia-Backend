const User = require("../models/userModel");
const Duty = require("../models/dutyModel");

const createDuties = async (req, res) => {
  try {
    const newDuty = new Duty(req.body);
    const savedDuty = await newDuty.save();
    res.status(201).json(savedDuty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDutiesForUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch duties where the user is assigned either at the week level OR in any individual day
    const duties = await Duty.find({
      $or: [
        { assignedUser: userId }, // User assigned at the week level
        { "days.assignedUser": userId }, // User assigned in any day's assignedUser
      ],
    }).populate("assignedUser", "name");

    if (!duties || duties.length === 0) {
      return res.status(404).json({ message: "No duties found for this user" });
    }

    // Extract only the days that belong to the user
    const filteredDuties = duties.map((duty) => ({
      _id: duty._id,
      weekNumber: duty.weekNumber,
      startDate: duty.startDate,
      endDate: duty.endDate,
      zone: duty.zone,
      status: duty.status,
      days: duty.days.filter((day) => day.assignedUser.toString() === userId), // Only show the user's assigned days
    }));

    res.status(200).json(filteredDuties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Change with hours---> waiting modifications
// ____________________________________________________________________________________
const deleteDutiesForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await Duty.deleteMany({ assignedUser: userId });
    if (result.deletedCount === 0) {
      return res
        .status(404)
        .json({ message: "No duties found for this user to delete" });
    }

    res.status(200).json({
      message: "Duties deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// __________________________________________________________________________________________________
const updateDutiesForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { dutyId, updateData } = req.body;

    const updatedDuty = await Duty.findOneAndUpdate(
      { _id: dutyId, assignedUser: userId },
      updateData,
      { new: true }
    );

    if (!updatedDuty) {
      return res
        .status(404)
        .json({ message: "Duty not found or not assigned to this user" });
    }

    res.status(200).json(updatedDuty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getDutyById = async (req, res) => {
  try {
    const { dutyId } = req.params;

    const duty = await Duty.findById(dutyId);

    if (!duty) {
      return res.status(404).json({ message: "Duty not found" });
    }

    res.status(200).json(duty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserWithDuties = async (req, res) => {
  try {
    const { userId } = req.params;

    const userD = await user.findById(userId);

    if (!userD) {
      return res.status(404).json({ message: "User not found" });
    }

    const duties = await Duty.find({ assignedUser: userId });

    res.status(200).json({
      username: userD.name,
      duties: duties,
      status: duties.status,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllDuties = async (req, res) => {
  try {
    const duties = await Duty.find();
    res.json(duties);
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while fetching duties",
      error: error.message,
    });
  }
};
// _______________________________________________________________________________________________________
const getDutiesByZone = async (req, res) => {
  try {
    const { zone } = req.params;

    if (!zone) {
      return res.status(400).json({ message: "Zone parameter is required" });
    }

    const duties = await Duty.find({ zone }).populate("assignedUser", "name"); // Get duties for this zone

    res.status(200).json(duties);
  } catch (error) {
    console.error("Error fetching duties by zone:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createDuties,
  getDutiesForUser,
  deleteDutiesForUser,
  updateDutiesForUser,
  getDutyById,
  getUserWithDuties,
  getAllDuties,
  getDutiesByZone,
};
