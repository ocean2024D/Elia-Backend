require("express-async-errors")
const express = require("express")
const app = express()
require("dotenv").config()
require("./src/db/dbConnection")
const port = process.env.PORT || 5001
const router = require("./src/routers")

const errorHandlerMiddleware = require("./src/middelwares/errorHandler")
const cors = require("cors")
//_____________________________________________________
// dans le fichier app.js
// const moment = require("moment-timezone")
// moment.tz.setDefault("Europe/Brussels")


// // dans le dossier utils // 
// import moment from "moment-timezone";

// moment.tz.setDefault("Europe/Brussels");

// export const getBrusselsTime = () => {
//     return moment().format("YYYY-MM-DD HH:mm:ss");
// };


// // import { getBrusselsTime } from "App/Utils/DateHelper";

// Route.get("/", async () => {
//     return { heure: getBrusselsTime() };
// });


//______________________________________________________


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


app.use("/api", router)


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
