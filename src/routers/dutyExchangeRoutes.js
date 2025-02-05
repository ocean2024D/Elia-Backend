const router = require("express").Router();
const {
  createDutyExchange,
  getAllDutyExchanges,
  getDutyExchangeById,
  acceptDutyRequest,
  rejectDutyRequest,
} = require("../controllers/dutyExchangeController");


router.post("/dutyExchange", createDutyExchange);


router.get("/dutyExchange", getAllDutyExchanges);


router.get("/dutyExchange/:exchangeId", getDutyExchangeById);


router.post('/accept/:id', acceptDutyRequest); // newObjectId we write in postman  Post  http://localhost:8080/api/accept/67a3dddd65d159d137aa4522,
// // Postman in Raw{  "acceptingUserId": "67a20681c3d78ecd7aa311e0"}




module.exports = router;
