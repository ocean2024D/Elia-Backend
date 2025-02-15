const User = require('../models/userModel');
const DutyExchange = require("../models/requestModel");
const Duty = require("../models/dutyModel");

// POST - Créer une nouvelle demande d'échange de garde
const createDutyExchange = async (req, res) => {
  try {
   
    for (let shift of req.body.Days) {
      const existingExchange = await DutyExchange.findOne({
        "Days.date": shift.date,
        "Days.requestStartTime": shift.requestStartTime,
        "Days.requestEndTime": shift.requestEndTime
      });

      if (existingExchange) {
        return res.status(400).send("This date and time range already exists in the system.");
      }
    }
    const requestingUser = await User.findById(req.body.requestingUser);
    const acceptingUser = await User.findById(req.body.acceptingUser);

    if (!requestingUser || !acceptingUser) {
      return res.status(404).send("One or both users not found");
    }
    requestingUser.negativeHours += 1; 
    acceptingUser.positiveHours += 1;

    await requestingUser.save();
    await acceptingUser.save();

    return res.status(201).json(savedDutyExchange);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET - Récupérer toutes les demandes d'échange de garde
const getAllDutyExchanges = async (req, res) => {
  try {
    const dutyExchanges = await DutyExchange.find()
      .populate("requestingUser", "name")
      

    dutyExchanges.forEach((exchange) => {
      if (exchange.requestingUser) {
        exchange.requestingUser = exchange.requestingUser.name;
      }
      if (exchange.acceptingUser) {
        exchange.acceptingUser = exchange.acceptingUser.name; 
        delete exchange.acceptingUser; 
      }
    });
   return res.status(200).json(dutyExchanges);
  } catch (error) {
   return res.status(500).json({ message: error.message });
  }
};

// GET - Récupérer une demande d'échange de garde par ID
const getDutyExchangeById = async (req, res) => {
  try {
      console.log("Request Body:", req.body); 
    console.log("Duty ID:", req.body.duty_id);
    console.log("Requesting User:", req.body.requestingUser);
    console.log("Accepting User:", req.body.acceptingUser);
    console.log("Days:", req.body.Days);
    const { exchangeId } = req.params;
    const dutyExchange = await DutyExchange.findById(exchangeId);

    if (!dutyExchange) {
      return res.status(404).json({ message: "Duty exchange not found" });
    }

   return res.status(200).json(dutyExchange);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const mongoose = require('mongoose');




const acceptDutyRequest = async (req, res) => {
  try {
    const requestId = req.params.id;

    const dutyExchange = await DutyExchange.findById(requestId)
      .populate("requestingUser", "name")
      .populate("acceptingUser", "name")
      .populate("Days.assignedUser", "name");

    if (!dutyExchange || dutyExchange.status !== "pending") {
      return res.status(404).send("No valid offer found");
    }

    if (!req.body.acceptingUser || !mongoose.Types.ObjectId.isValid(req.body.acceptingUser)) {
      return res.status(400).send("Valid accepting user ID is required");
    }

    dutyExchange.acceptingUser = req.body.acceptingUser;
    dutyExchange.status = "accepted"; 
    await dutyExchange.save();

    const requestingDutyId = dutyExchange.duty_id;
    console.log("Requesting Duty ID:", requestingDutyId);

    const requestingDuty = await Duty.findById(dutyExchange.duty_id);
    if (!requestingDuty) {
      return res.status(404).send("Requesting duty not found");
    }

    if (!requestingDuty.days || requestingDuty.days.length === 0) {
      return res.status(404).send("No dailyShifts found in requesting duty");
    }

    
    let updatePromises = dutyExchange.Days.map(async (shift) => {
      console.log(`dutyExchangeRequest inside: ${JSON.stringify(shift)}`);

      let dutyShift = requestingDuty.days.find(d => d.date.toISOString() === shift.date.toISOString());
      if (dutyShift) {
        dutyShift.assignedUser = req.body.acceptingUser;
        dutyShift.status = "sick"; 
      }

      const duty = await Duty.findById(dutyExchange.duty_id);
      if (duty) {
        duty.exchangeDetails.push({
          requestingUser: shift.requestingUser,
          acceptingUser: req.body.acceptingUser,
          requestStartTime: shift.requestStartTime,  
          requestEndTime: shift.requestEndTime,      
          reasonOfChange: shift.reasonOfChange 
     
        });

        return duty.save(); 
      }
    });

    await Promise.all(updatePromises); 
    await requestingDuty.save();

    return res.send("Duty exchange accepted and shifts updated successfully");

  } catch (error) {
    console.error("Error updating duty exchange:", error);
    return res.status(500).send("Internal server error");
  }
};


module.exports = {
  createDutyExchange,
  getAllDutyExchanges,
  getDutyExchangeById,
  acceptDutyRequest,

};