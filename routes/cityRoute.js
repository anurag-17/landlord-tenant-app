const express = require('express');
const { addcity, updateCity, deleteCity, getCities, getCityByStateId, getCityById } = require('../controllers/CityAuth');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');
const router = express.Router();

router.route("/add").post(isAuthenticatedUser,authorizeRoles("admin"),addcity)
router.route("/update/:id").put(isAuthenticatedUser,authorizeRoles("admin"),updateCity)
router.route("/delete/:id").delete(isAuthenticatedUser,authorizeRoles("admin"),deleteCity)
router.route("/getAll").get(isAuthenticatedUser,getCities)
router.route("/getByState/:stateId").get(isAuthenticatedUser,getCityByStateId)
router.route("/getById/:id").get(isAuthenticatedUser, authorizeRoles("admin"),getCityById)
module.exports = router;