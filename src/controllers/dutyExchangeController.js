const User = require('../models/userModel');
const DutyExchange = require("../models/dutyExchangeModel");


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
      const dutyExchanges = await DutyExchange.find();
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
  //______________________________________________________________________________________
  
// POST - Accept a duty exchange request
const acceptDutyRequest = async (req, res) => {
  try {
    const dutyExchange = await DutyExchange.findById(req.params.id);

    if (!dutyExchange || dutyExchange.status !== 'pending') {
      return res.status(404).send('No valid offer found');
    }

    dutyExchange.status = 'accepted'; //
    dutyExchange.acceptingUser = req.body.acceptingUserId;

    await dutyExchange.save();
// Récupération des utilisateurs
    const requestingUser = await User.findById(dutyExchange.requestingUser);
    const acceptingUser = await User.findById(dutyExchange.acceptingUser);

    if (!requestingUser || !acceptingUser) {
      return res.status(404).send("One or both users not found");
    }

    // Mise à jour des heures
    requestingUser.negativeHours += 1; // 1 à modifier en fonction du nombre d'heures échangées
    acceptingUser.positiveHours += 1; 

    await requestingUser.save();
    await acceptingUser.save();

    res.status(200).send('Duty exchange accepted and hours updated!');
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred');
  }
};





  module.exports = {
    createDutyExchange,
    getAllDutyExchanges,
    getDutyExchangeById,
    acceptDutyRequest,
  
  };