require("express-async-errors")
const express = require("express")
const app = express()
require("dotenv").config()
require("./src/db/dbConnection")
const port = process.env.PORT || 5001
const authRoutes = require("./src/routers/authRoutes")
const dutyExchangeRoutes = require("./src/routers/RequestRoutes")
const dutyRoutes = require("./src/routers/dutyRoutes")
const dutySchedulerRoutes = require("./src/routers/dutySchedulerRoutes")
const errorHandlerMiddleware = require("./src/middelwares/errorHandler")
const cors = require("cors")


//Middelwares
app.use(express.json())
app.use(express.json({limit: "50mb"}))
app.use(express.urlencoded({limit: "50mb", extended: true, parameterLimit: 50000}))


// CORS Middleware
app.use(cors({
  origin: "http://localhost:5173", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"], 
  credentials: true
}));


app.use("/api/auth", authRoutes)
app.use("/api/dutyExchange", dutyExchangeRoutes)
app.use("/api/duties", dutyRoutes)
app.use("/api/dutyScheduler",dutySchedulerRoutes)

app.get("/", (req, res) => {
    res.json({
    message: "Bienvenue"
    })
})


//Capter les erreurs 
app.use(errorHandlerMiddleware)




app.listen(port, () => {
    console.log(`Le server fonctionne sur le port ${port}`);
    
})
