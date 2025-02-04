class Response {
    constructor(data= null, message = null, status = 200)  {
        this.data = data
        this.message = message
        this.status = status
    }

    succes(res) {
        return res.status(200).json({
            succes: true, 
            data : this.data, 
            message : this.message ?? "Opération réussi"
        })
    }

    created(res) {
        return res.status(201).json({
            succes: true, 
            data : this.data, 
            message : this.message ?? "Compte crée avec succès"
        })
    }

    error500(res) {
        return res.status(500).json({
            succes: false, 
            data : this.data, 
            message : this.message ?? "Opération non réussi !"
        })
    }

    error400(res) {
        return res.status(400).json({
            succes: false, 
            data : this.data, 
            message : this.message ?? "Opération non réussie !"
        })
    }

    error401(res) {
        return res.status(401).json({
            succes: false, 
            data : this.data, 
            message : this.message ?? "Ouvrez un compte !"
        })
    }

    error404(res) {
        return res.status(404).json({
            succes: false, 
            data : this.data, 
            message : this.message ?? "Opération non réussie !"
        })
    }

    error429(res) {
        return res.status(429).json({
            succes: false, 
            data : this.data, 
            message : this.message ?? "Attention Trop de requêtes !"
        })
    }
}

module.exports = Response