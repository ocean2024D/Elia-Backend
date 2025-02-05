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
  
  module.exports = {
    createDutyExchange,
    getAllDutyExchanges,
    getDutyExchangeById,
  };