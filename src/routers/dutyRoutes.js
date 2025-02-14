const router = require("express").Router();
const {
  createDuties,
  getDutiesForUser,
  deleteDutiesForUser,
  updateDutiesForUser,
  getDutyById,
  getUserWithDuties,
  getAllDuties,
  requestDutyExchange,
  getDutiesByZone,
} = require("../controllers/dutyController");

router.post("/", createDuties);
router.get("/:userId", getDutiesForUser);

router.delete(
  "/delete/:userId",
  (req, res, next) => {
    console.log("Delete request received for user ID:", req.params.userId);
    next();
  },
  deleteDutiesForUser
);

router.put(
  "/update/:userId",
  (req, res, next) => {
    console.log("Update request received for user ID:", req.params.userId);
    next();
  },
  updateDutiesForUser
);

router.get("/:userId", getDutyById);

router.get("/user/:userId/duties", getUserWithDuties);
router.get("/", getAllDuties);

router.get("/zone/:zone", getDutiesByZone);

module.exports = router;
