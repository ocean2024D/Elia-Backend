const mongoose = require("mongoose");
const Duty = require("../models/dutyModel");
const User = require("../models/userModel");

// 📌 Fonction pour générer un planning de gardes pour 6 semaines
const generateDutySchedule = async () => {
    try {
        const users = await User.find({});
        if (users.length < 6) {
            console.error("Il faut au moins 6 utilisateurs pour un cycle complet de garde.");
            return;
        }
        
        let startDate = new Date();
        startDate.setHours(7, 30, 0, 0); // Début le jeudi à 7h30
        while (startDate.getDay() !== 4) { // 4 correspond à jeudi
            startDate.setDate(startDate.getDate() + 1);
        }
        
        let duties = [];
        
        for (let i = 0; i < 6; i++) { // 6 semaines de planning
            users.forEach((user, index) => {
                duties.push({
                    startDate: new Date(startDate.getTime() + i * 7 * 24 * 60 * 60 * 1000),
                    endDate: new Date(startDate.getTime() + (i + 1) * 7 * 24 * 60 * 60 * 1000),
                    assignedUser: user._id,
                    status: "working",
                    zone: "Zone " + ((index % 3) + 1),
                });
            });
        }

        await Duty.insertMany(duties);
        console.log("✅ Planning de gardes généré avec succès !");
    } catch (error) {
        console.error("❌ Erreur lors de la génération du planning :", error);
    }
};

// 📌 Fonction pour initialiser le planning si aucune garde n’existe
const initializeSchedule = async () => {
    try {
        const existingDuties = await Duty.countDocuments();
        if (existingDuties === 0) {
            console.log("📅 Aucun planning existant, création du planning...");
            await generateDutySchedule();
        } else {
            console.log("📅 Planning déjà existant, aucune action nécessaire.");
        }
    } catch (error) {
        console.error("❌ Erreur lors de l'initialisation du planning :", error);
    }
};

module.exports = { generateDutySchedule, initializeSchedule };
