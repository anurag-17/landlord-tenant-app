const express = require('express');
const { addState, getAllStates, deleteState, updateState, getStateById } = require('../controllers/StateController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');
const router = express.Router();

router.route("/add").post(isAuthenticatedUser,authorizeRoles("admin"), addState)
router.route("/getAll").get(getAllStates)
router.route("/deleteState/:id").delete(isAuthenticatedUser, authorizeRoles("admin"),deleteState)
router.route("/update/:id").put(isAuthenticatedUser, authorizeRoles("admin"),updateState)
router.route("/getstate/:id").get(isAuthenticatedUser, authorizeRoles("admin"),getStateById)
module.exports = router;