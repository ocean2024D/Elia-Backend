const User = require("../models/userModel");
const DutyExchange = require("../models/requestModel");
const Duty = require("../models/dutyModel");

// POST - Créer une nouvelle demande d'échange de garde
/*const createDutyExchange = async (req, res) => {
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
  } */
//////////////////////////////////////////////////////////////////////
// Create duty with requesting user set from logged in user
const createDutyExchange = async (req, res) => {
  try {
    const { requestingUser, acceptingUser, Days, reasonOfExChange } = req.body;

    // Ensure requestingUser is included
    if (!requestingUser) {
      return res.status(400).json({ message: "Requesting user is required." });
    }

    if (!Days || Days.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one shift day is required." });
    }

    const requests = [];

    // 🔹 Create a separate request for each day
    for (let day of Days) {
      const newRequest = new DutyExchange({
        requestingUser,
        acceptingUser: acceptingUser || null, // If null, request is open to all
        status: "pending",
        Days: [day], // ✅ Each request will only contain one day
        reasonOfExChange,
      });

      const savedRequest = await newRequest.save();
      requests.push(savedRequest);
    }

    console.log("✅ Shift change requests created:", requests.length);

    res.status(201).json({
      message: `${requests.length} shift change request(s) created.`,
      requests,
    });
  } catch (error) {
    console.error("❌ Error creating duty exchange:", error);
    res.status(500).json({ message: error.message });
  }
};

///////////////////////////////////////////////////////////////////////////////////////
//New Api to get the db requests into the homepage
const getShiftRequestsForUser = async (req, res) => {
  try {
    const { zone, userId } = req.params;

    const requests = await DutyExchange.find({
      $or: [
        { acceptingUser: null }, // Open request, visible to all in the zone
        { acceptingUser: userId }, // Request assigned to the user
        { requestingUser: userId }, // User made the request
      ],
    })
      .populate("requestingUser", "name")
      .populate("acceptingUser", "name");

    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching shift requests:", error);
    res.status(500).json({ message: error.message });
  }
};

// GET - Récupérer toutes les demandes d'échange de garde
const getAllDutyExchanges = async (req, res) => {
  try {
    const dutyExchanges = await DutyExchange.find()
      .populate("requestingUser", "name") // ✅ Get the name of the requester
      .populate("acceptingUser", "name"); // ✅ Get the name of the acceptor

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
const mongoose = require("mongoose");

const acceptDutyRequest = async (req, res) => {
  try {
    const { id } = req.params; // Request ID
    const { acceptingUser } = req.body; // User accepting the shift

    console.log("📩 Accept Request Received:", { id, acceptingUser });

    // Validate request
    if (!mongoose.Types.ObjectId.isValid(acceptingUser)) {
      console.error("🔴 Invalid accepting user ID:", acceptingUser);
      return res.status(400).json({ message: "Invalid accepting user ID." });
    }

    // Find the request in the database
    const dutyExchange = await DutyExchange.findById(id);

    if (!dutyExchange || dutyExchange.status !== "pending") {
      console.error("🔴 No valid pending request found.");
      return res
        .status(404)
        .json({ message: "No valid pending request found." });
    }

    if (dutyExchange.acceptingUser) {
      console.error(
        "🔴 Shift request already accepted by:",
        dutyExchange.acceptingUser
      );
      return res
        .status(400)
        .json({ message: "Shift request already accepted by another user." });
    }

    // ✅ Update the `acceptingUser` field for the entire request
    dutyExchange.acceptingUser = acceptingUser;
    dutyExchange.status = "accepted";

    await dutyExchange.save();

    console.log("✅ Shift successfully accepted by user:", acceptingUser);
    return res.json({
      message: "Shift accepted successfully.",
      updatedRequest: dutyExchange,
    });
  } catch (error) {
    console.error("❌ Error updating duty exchange:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createDutyExchange,
  getAllDutyExchanges,
  getDutyExchangeById,
  acceptDutyRequest,
  getShiftRequestsForUser,
};
