const express = require('express');
const { addcity } = require('../controllers/CityAuth');
const router = express.Router();

router.route("/add").post(addcity)

module.exports = router;