// const dutyExchangeModel = require("../models/dutyExchangeModel");
const DutyExchange = require("../models/dutyExchangeModel");
const Duty = require("../models/dutyModel");

// POST - Créer une nouvelle demande d'échange de garde
const createDutyExchange = async (req, res) => {
  try {
    const newDutyExchange = new DutyExchange(req.body);
    const savedDutyExchange = await newDutyExchange.save();
    res.status(201).json(savedDutyExchange);
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
        exchange.requestingUserName = exchange.requestingUser.name;
      }
      if (exchange.acceptingUser) {
        exchange.acceptingUserName = exchange.acceptingUser.name; 
        delete exchange.acceptingUser; 
      }
    });
    res.status(200).json(dutyExchanges);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

    res.status(200).json(dutyExchange);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const mongoose = require('mongoose');




const acceptDutyRequest = async (req, res) => {

  try {
    const requestId = req.params.id;
    const dutyExchange = await DutyExchange.findById(requestId)
      .populate("requestingUser", "name")
      .populate("acceptingUser", "name")
      .populate("shiftDays.assignedUser", "name");

    if (!dutyExchange || dutyExchange.status !== "pending") {
      return res.status(404).send("No valid offer found");
    }

   
    if (!req.body.acceptingUser || !mongoose.Types.ObjectId.isValid(req.body.acceptingUser)) {
      return res.status(400).send("Valid accepting user ID is required");
    }
    
    dutyExchange.acceptingUser = req.body.acceptingUser;
    dutyExchange.status = "accepted";//ca doit etre dynamique
    await dutyExchange.save();



    const requestingDuty = await Duty.findById(dutyExchange.duty_id);
    console.log(` Duty inside  : ${requestingDuty}`)
    if (!requestingDuty) {
      return res.status(404).send("Requesting duty not found");
    }

 
    dutyExchange.shiftDays.forEach((shift) => {
      console.log(`dutyExchangeRequest inside : ${shift}`)
      let dutyShift = requestingDuty.dailyShifts.find(d => d.date.toISOString() === shift.date.toISOString());
      console.log(dutyShift)
      if (dutyShift) {
        dutyShift.assignedUser = req.body.acceptingUser; 
         dutyShift.status = "sick"; 
  
      }
    });

    await requestingDuty.save();
    res.send("Duty exchange accepted and shifts updated successfully");

  } catch (error) {0
    console.error("Error updating duty exchange:", error);
    res.status(500).send("Internal server error");
  }
}; 
module.exports = {
  createDutyExchange,
  getAllDutyExchanges,
  getDutyExchangeById,
  acceptDutyRequest,
};
