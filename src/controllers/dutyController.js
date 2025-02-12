const user = require("../models/userModel");
const Duty = require("../models/dutyModel");

const Duties = async (req, res) => {
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

    const duties = await Duty.find({ assignedUser: userId });
    if (duties.length === 0) {
      return res.status(404).json({ message: "No duties found for this user" });
    }

    res.status(200).json(duties);
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

    res
      .status(200)
      .json({
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
      status :duties.status,
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



module.exports = {
  Duties,
  getDutiesForUser,
  deleteDutiesForUser,
  updateDutiesForUser,
  getDutyById,
  getUserWithDuties,
  getAllDuties,

};
