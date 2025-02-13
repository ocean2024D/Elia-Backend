const User = require('../models/userModel');
const DutyExchange = require("../models/requestModel");
const Duty = require("../models/dutyModel");

// POST - Créer une nouvelle demande d'échange de garde
const createDutyExchange = async (req, res) => {
  try {
    const newDutyExchange = new DutyExchange(req.body);
    const savedDutyExchange = await newDutyExchange.save();
   return res.status(201).json(savedDutyExchange);
  } catch (error) {
 res.status(500).json({ message: error.message });
  };
    // const dutyExchange = await DutyExchange.findById(req.params.id);

    // if (!dutyExchange || dutyExchange.status !== 'pending') {
    //   return res.status(404).send('No valid offer found');
    // }

    // dutyExchange.status = 'accepted'; //
    // dutyExchange.acceptingUser = req.body.acceptingUserId;

    // await dutyExchange.save();
// Récupération des utilisateurs
    const requestingUser = await User.findById(DutyExchange.requestingUser);
    const acceptingUser = await User.findById(DutyExchange.acceptingUser);

    if (!requestingUser || !acceptingUser) {
      return res.status(404).send("One or both users not found");
    }

    // Mise à jour des heures
    requestingUser.negativeHours += 1; // 1 à modifier en fonction du nombre d'heures échangées
    acceptingUser.positiveHours += 1; 

    await requestingUser.save();
    await acceptingUser.save();

    res.status(200).send('Duty exchange accepted and hours updated!');
  } 


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


    const requestingDuty = await Duty.findById(dutyExchange.duty_id);
    console.log("Requested Duty:", requestingDuty);

    if (!requestingDuty) {
      return res.status(404).send("Requesting duty not found");
    }

    if (!requestingDuty.days || requestingDuty.days.length === 0) {
      return res.status(404).send("No dailyShifts found in requesting duty");
    }

    dutyExchange.Days.forEach((shift) => {
      console.log(`dutyExchangeRequest inside: ${JSON.stringify(shift)}`);

     
      let dutyShift = requestingDuty.days.find(d => d.date.toISOString() === shift.date.toISOString());
      console.log(`dutyShift: ${JSON.stringify(dutyShift)}`);

      if (dutyShift) {
        dutyShift.acceptedUser = req.body.acceptingUser;
        dutyShift.status = "sick"; 
      }
    });

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