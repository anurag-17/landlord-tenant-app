const express = require('express');
const { addState, getAllStates } = require('../controllers/StateController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');
const router = express.Router();

router.route("/add").post(isAuthenticatedUser,authorizeRoles("admin"), addState)
router.route("/getAll").get(getAllStates)
module.exports = router;