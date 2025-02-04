const router = require("express").Router();
const {
  Duties,
  getDutiesForUser,
  deleteDutiesForUser,
  updateDutiesForUser,
  getDutyById,
  getUserWithDuties,
} = require("../controllers/dutyController");

router.post("/duties", Duties);
router.get("/duties/:userId", getDutiesForUser);

router.delete(
  "/duties/delete/:userId",
  (req, res, next) => {
    console.log("Delete request received for user ID:", req.params.userId);
    next();
  },
  deleteDutiesForUser
);

router.put(
  "/duties/update/:userId",
  (req, res, next) => {
    console.log("Update request received for user ID:", req.params.userId);
    next();
  },
  updateDutiesForUser
);

router.get("/duties/:userId", getDutyById);

router.get("/user/:userId/duties", getUserWithDuties);

module.exports = router;
