const router = require("express").Router();
const {
  createDutyExchange,
  getAllDutyExchanges,
  getDutyExchangeById,
} = require("../controllers/dutyExchangeController");


router.post("/dutyExchange", createDutyExchange);


router.get("/dutyExchange", getAllDutyExchanges);


router.get("/dutyExchange/:exchangeId", getDutyExchangeById);

module.exports = router;
