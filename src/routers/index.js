const router = require("express").Router();

const dutydd = require("./dutyRoutes");

const auth = require("./authRoutes");

router.use(auth);
router.use(dutydd);

module.exports = router;
