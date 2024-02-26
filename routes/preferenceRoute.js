const express = require("express");
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { createPreference, deletePreference, getPreference, getAllPreferences, updatePreference } = require("../controllers/PreferenceController");


router.route("/addPreference").post(isAuthenticatedUser,authorizeRoles("admin"),createPreference)
router.route("/updatePreference").put(isAuthenticatedUser,authorizeRoles("admin"),updatePreference)
router.route("/deletePreference/:id").delete(isAuthenticatedUser, authorizeRoles("admin"), deletePreference)
router.route("/getPreference/:id").get(isAuthenticatedUser,authorizeRoles("admin"),getPreference)
router.route("/getAllPreference").get(isAuthenticatedUser,getAllPreferences)


module.exports = router;