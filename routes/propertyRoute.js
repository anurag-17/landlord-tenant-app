const express = require('express');
const router = express.Router();
const { addProperty, getPropertyById, editProperty, deletePropertyById, searchProperties, filterProperties } = require("../controllers/PropertyController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");


router.route("/addProperty").post(isAuthenticatedUser, addProperty)
// Route to get a property by ID
router.route("/property/:id").get(isAuthenticatedUser,getPropertyById);
// Route to edit a property by ID
router.route("/property/:id").put(isAuthenticatedUser, editProperty);
// Route to delete a property by ID
router.route("/property/:id").delete(isAuthenticatedUser, deletePropertyById);
// Route to search properties by title and provinces with pagination
router.route("/properties/search").get(searchProperties);
//Route to search property using user preference
router.route("/properties/user").post(isAuthenticatedUser,filterProperties);


module.exports = router;