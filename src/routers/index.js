const router = require("express").Router();

const dutyExchangeRoutes = require('./dutyExchangeRoutes');

const dutydd = require("./dutyRoutes");

const auth = require("./authRoutes");


router.use(dutyExchangeRoutes);
router.use(auth);
router.use(dutydd);


module.exports = router;
