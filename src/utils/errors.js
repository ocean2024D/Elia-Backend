class APIError extends Error {
    constructor(message, StatusCode) {
        super(message)
        this.StatusCode = StatusCode || 400
    }
}

module.exports = APIError