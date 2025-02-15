const user = require("../models/userModel");
const Duty = require("../models/dutyModel");
const bycrypt = require("bcrypt");
const APIError = require("../utils/errors");
const Response = require("../utils/response");
const { createToken } = require("../middelwares/auth");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userInfo = await user.findOne({ email });

    if (!userInfo) {
      throw new APIError("Email ou mot de passe incorrecte", 401);
    }

    const comparePassword = await bycrypt.compare(password, userInfo.password);
    if (!comparePassword) {
      throw new APIError("Email ou mot de passe incorrecte", 401);
    }
    // Generate JWT token
    const token = createToken(userInfo);

    //  Send user data along with the token needed for fetch and populate homepage
    return res.json({
      succes: true,
      token,
      user: {
        id: userInfo._id,
        name: userInfo.name,
        lastname: userInfo.lastname,
        email: userInfo.email,
        zone: userInfo.zone,
        isAdmin: userInfo.isAdmin,
      },
      message: "Réussi",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const register = async (req, res) => {
  const { email } = req.body;

  const userCheck = await user.findOne({ email });

  if (userCheck) {
    throw new APIError("Cette adresse est déjà utilisée !", 401);
  }

  req.body.password = await bycrypt.hash(req.body.password, 10);

  console.log("Hash code :", req.body.password);

  const userSave = new user(req.body);
  await userSave
    .save()
    .then((data) => {
      return new Response(data, "L'enregistrement pris en compte").created(res);
    })
    .catch((err) => {
      throw new APIError("L'utilisateur ne peut être pris en compte !", 400);
    });
};

const me = async (req, res) => {
  return new Response(req.user).succes(res);
};
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const mongoose = require("mongoose");
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new APIError("ID utilisateur invalide", 400);
    }

    const deletedUser = await user.findByIdAndDelete(id);

    if (!deletedUser) {
      throw new APIError("Utilisateur non trouvé", 404);
    }

    return new Response(null, "Utilisateur supprimé avec succès").succes(res);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression de l'utilisateur",
      error: error.message,
    });
  }
};

const getUsers = async (req, res) => {
  //ajouté
  try {
    const users = await user.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while fetching users",
      error: error.message,
    });
  }
};
// Fetch users by zone
const getUsersByZone = async (req, res) => {
  try {
    const { zone } = req.params;
    const usersInZone = await user.find({ zone });

    if (!usersInZone || usersInZone.length === 0) {
      throw new APIError("No users found for the given zone", 404);
    }

    return res.json(usersInZone);
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while fetching users by zone",
      error: error.message,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params; // Get the user ID from the URL parameter

    const userInfo = await user.findById(id); // Query the database for the user

    if (!userInfo) {
      throw new APIError("User not found", 404); // If the user is not found, throw an error
    }

    // Return the user data
    return res.json({
      success: true,
      user: {
        id: userInfo._id,
        name: userInfo.name,
        lastname: userInfo.lastname,
        email: userInfo.email,
        zone: userInfo.zone,
        isAdmin: userInfo.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while fetching user data",
      error: error.message,
    });
  }
};
module.exports = {
  login,
  register,
  me,
  deleteUser,
  getUsers,
  getUsersByZone,
  getUserById,
};
