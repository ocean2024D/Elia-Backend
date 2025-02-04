const joi = require("joi");
const APIError = require("../../utils/errors");

class authValidation {
    static register = async (req, res, next) => {
        try {
            const registerSchema = joi.object({
                name: joi.string().trim().min(3).max(100).required().messages({
                    "string.base": "Le prénom doit contenir des caractères valides",
                    "string.empty": "Le prénom ne peut pas être vide",
                    "string.min": "Le prénom doit avoir au moins 3 caractères",
                    "string.max": "Le prénom doit avoir au maximum 100 caractères",
                    "any.required": "Le prénom est obligatoire"
                }),
                lastname: joi.string().trim().min(3).max(100).required().messages({
                    "string.base": "Le nom doit contenir des caractères valides",
                    "string.empty": "Le nom ne peut pas être vide",
                    "string.min": "Le nom doit avoir au moins 3 caractères",
                    "string.max": "Le nom doit avoir au maximum 100 caractères",
                    "any.required": "Le nom est obligatoire"
                }),
                email: joi.string().email().trim().min(3).max(100).required().messages({
                    "string.base": "L'email doit contenir des caractères valides",
                    "string.empty": "L'email ne peut pas être vide",
                    "string.min": "L'email doit avoir au moins 3 caractères",
                    "string.email": "L'email doit être valide",
                    "string.max": "L'email doit avoir au maximum 100 caractères",
                    "any.required": "L'email est obligatoire"
                }),
                password: joi.string().trim().min(6).max(36).required().messages({
                    "string.base": "Le mot de passe doit contenir des caractères valides",
                    "string.empty": "Le mot de passe ne peut pas être vide",
                    "string.min": "Le mot de passe doit avoir au moins 6 caractères",
                    "string.max": "Le mot de passe doit avoir au maximum 36 caractères",
                    "any.required": "Le mot de passe est obligatoire"
                }),
                isAdmin : joi.string().messages()
            });

            await registerSchema.validateAsync(req.body, { abortEarly: false });
            next();
        } catch (error) {
            if (error.details) {
                return next(new APIError(
                    error.details.map((err) => err.message).join(", "),
                    400
                ));
            }
            return next(new APIError("Erreur de validation inconnue", 400));
        }
    };

    static login = async (req, res, next) => {
        try {
            const loginSchema = joi.object({
                email: joi.string().email().trim().min(3).max(100).required().messages({
                    "string.base": "L'email doit contenir des caractères valides",
                    "string.empty": "L'email ne peut pas être vide",
                    "string.min": "L'email doit avoir au moins 3 caractères",
                    "string.email": "L'email doit être valide",
                    "string.max": "L'email doit avoir au maximum 100 caractères",
                    "any.required": "L'email est obligatoire"
                }),
                password: joi.string().trim().min(6).max(36).required().messages({
                    "string.base": "Le mot de passe doit contenir des caractères valides",
                    "string.empty": "Le mot de passe ne peut pas être vide",
                    "string.min": "Le mot de passe doit avoir au moins 6 caractères",
                    "string.max": "Le mot de passe doit avoir au maximum 36 caractères",
                    "any.required": "Le mot de passe est obligatoire"
                })
            });

            await loginSchema.validateAsync(req.body, { abortEarly: false });
            next();
        } catch (error) {
            if (error.details) {
                return next(new APIError(
                    error.details.map((err) => err.message).join(", "),
                    400
                ));
            }
            return next(new APIError("Erreur de validation inconnue", 400));
        }
    };
}

module.exports = authValidation;
