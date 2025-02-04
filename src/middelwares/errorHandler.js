const APIError = require("../utils/errors")

const errorHandlerMiddleware = (err, req, res, next) => {
    if (err instanceof APIError) {
        return res.status(err.StatusCode || 400)
        .json({
            succes: false, 
            message: err.message
        })
    }
    return res.status(500).json({
        succes: false, 
        message: "Problème rencontré, vérifiez votre API"
    })
}

module.exports = errorHandlerMiddleware