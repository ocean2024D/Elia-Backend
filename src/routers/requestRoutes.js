const router = require("express").Router();
const {
  createDutyExchange,
  getAllDutyExchanges,
  getDutyExchangeById,
  acceptDutyRequest,
  getDutyExchangesByUserId,
  rejectDutyRequest,
  getShiftRequestsForUser,
} = require("../controllers/requestController");

router.post("/", createDutyExchange);


router.get("/", getAllDutyExchanges);

router.get("/:exchangeId", getDutyExchangeById);

router.post("/accept/:id", acceptDutyRequest); // newObjectId we write in postman  Post  http://localhost:8080/api/accept/67a3dddd65d159d137aa4522,


router.get("/:user/:userId", getDutyExchangesByUserId);//By user Id retrieving DutiesExchanges

// // Postman in Raw{  "acceptingUserId": "67a20681c3d78ecd7aa311e0"}
//updating the request with the response of accepting user

router.put("/accept/:id", acceptDutyRequest);

//get requests for the homepage

router.get("/:zone/:userId", getShiftRequestsForUser);

module.exports = router;
