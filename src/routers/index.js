const router = require("express").Router();

const dutyExchangeRoutes = require('./dutyExchangeRoutes');

const dutydd = require("./dutyRoutes");

const auth = require("./authRoutes");


router.use('/dutyExchange', dutyExchangeRoutes)
router.use('/users', auth);
router.use('/duties', dutydd);


module.exports = router;
