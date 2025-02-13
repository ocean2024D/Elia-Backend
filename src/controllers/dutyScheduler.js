const mongoose = require("mongoose");
const Duty = require("../models/dutyModel");
const User = require("../models/userModel");

// Fonction pour générer un planning de gardes pour 6 semaines
const generateDutySchedule = async () => {
    try {
        const users = await User.find({});
        
        if (users.length < 6) {
            console.error("Il faut au moins 6 utilisateurs par zone pour un cycle complet de garde.");
            return;
        }

        // Grouper les utilisateurs par zone
        const usersByZone = {};
        users.forEach(user => {
            if (!usersByZone[user.zone]) {
                usersByZone[user.zone] = [];
            }
            usersByZone[user.zone].push(user);
        });

        let startDate = new Date();
        startDate.setHours(7, 30, 0, 0); // Début le jeudi à 7h30

        // Trouver le premier jeudi à partir d'aujourd'hui
        while (startDate.getDay() !== 4) { // 4 correspond à jeudi
            startDate.setDate(startDate.getDate() + 1);
        }

        let duties = [];

        // Générer le planning pour 6 semaines
        for (let i = 0; i < 6; i++) {
            for (const zone in usersByZone) {
                let zoneUsers = usersByZone[zone];

                if (zoneUsers.length < 6) {
                    console.error(`Pas assez d'utilisateurs dans la zone ${zone}. Minimum requis : 6`);
                    continue;
                }

                let assignedUser = zoneUsers[i % zoneUsers.length]; // Rotation entre les 6 utilisateurs

                let duty = {
                    startDate: new Date(startDate.getTime() + i * 7 * 24 * 60 * 60 * 1000), // Jeudi 7h30
                    endDate: new Date(startDate.getTime() + (i + 1) * 7 * 24 * 60 * 60 * 1000), // Jeudi suivant 7h30
                    assignedUser: assignedUser._id,
                    status: "working",
                    zone: zone,
                };

                duties.push(duty);
            }
        }

        await Duty.insertMany(duties);
        console.log("Planning de gardes généré avec succès !");
    } catch (error) {
        console.error("Erreur lors de la génération du planning :", error);
    }
};

// Fonction pour initialiser le planning si aucune garde n’existe
const initializeSchedule = async () => {
    try {
        const existingDuties = await Duty.countDocuments();
        if (existingDuties === 0) {
            console.log("Aucun planning existant, création du planning...");
            await generateDutySchedule();
        } else {
            console.log("Planning déjà existant, aucune action nécessaire.");
        }
    } catch (error) {
        console.error("Erreur lors de l'initialisation du planning :", error);
    }
};

module.exports = { generateDutySchedule, initializeSchedule };
