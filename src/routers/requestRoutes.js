const router = require("express").Router();
const {
  createDutyExchange,
  getAllDutyExchanges,
  getDutyExchangeById,
  acceptDutyRequest,
  getDutyExchangesByUserId,
  rejectDutyRequest,
} = require("../controllers/requestController");



router.post("/", createDutyExchange);


router.get("/", getAllDutyExchanges);//get all exchanges //Endponints
//  http://localhost:8080/api/dutyExchange?status=accepted
// http://localhost:8080/api/dutyExchange?status=rejected
// http://localhost:8080/api/dutyExchange?status=pending


router.get("/:exchangeId", getDutyExchangeById); //by dutyExchangeID

router.get("/:user/:userId", getDutyExchangesByUserId);//By user Id retrieving DutiesExchanges
router.post('/accept/:id', acceptDutyRequest); // newObjectId we write in postman  Post  http://localhost:8080/api/accept/67a3dddd65d159d137aa4522,
// // Postman in Raw{  "acceptingUserId": "67a20681c3d78ecd7aa311e0"}




module.exports = router;
