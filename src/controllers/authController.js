const user = require("../models/userModel")
const bycrypt = require("bcrypt");
const APIError = require("../utils/errors");
const Response = require("../utils/response");
const { createToken } = require("../middelwares/auth");


const login = async (req, res) =>{
    const {email, password} = req.body

    const userInfo = await user.findOne({email})

    if (!userInfo)
        throw new APIError("Email ou mot de passe incorrecte")

    const comparePassword = await bycrypt.compare(password, userInfo.password)

    if(!comparePassword)
        throw new APIError("Email ou mot de passe incorrecte", 401)

    createToken(userInfo, res)

    
}

const register = async (req, res) => {
    const { email } = req.body

    const userCheck = await user.findOne({email})

    if (userCheck) {
        throw new APIError("Cette adresse est déjà utilisée !", 401)

    }

    req.body.password = await bycrypt.hash(req.body.password, 10 )

    console.log("Hash code :", req.body.password);


    const userSave = new user(req.body)
    await userSave.save()
        .then((data) => {

            return new Response(data, "L'enregistrement pris en compte").created(res)
        })
        .catch((err) => {
            throw new APIError("L'utilisateur ne peut être pris en compte !", 400)
        })
}

const me = async (req, res) => {
    return new Response(req.user).succes(res)
    
    
}
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Vérifier si l'ID est valide
        const mongoose = require("mongoose");
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new APIError("ID utilisateur invalide", 400);
        }

        // Supprimer l'utilisateur
       const deletedUser = await user.findByIdAndDelete(id);

        if (!deletedUser) {
            throw new APIError("Utilisateur non trouvé", 404);
        } 

        return new Response(null, "Utilisateur supprimé avec succès").succes(res);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur", error: error.message });
    }
};

module.exports = {
    login, 
    register,
    me,
    deleteUser
}