const express = require('express');
const router = express.Router();
const { addProperty, getPropertyById, editProperty, deletePropertyById, searchProperties, filterProperties, addToWishlist, deleteAllWishlistItems, propertyData } = require("../controllers/PropertyController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const { addReview, deleteReview, deleteReviewByUser } = require('../controllers/ReviewController');


router.route("/addProperty").post(isAuthenticatedUser, addProperty)
// Route to get a property by ID
router.route("/property/:id").get(isAuthenticatedUser,getPropertyById);
// Route to edit a property by ID
router.route("/property/:id").put(isAuthenticatedUser, editProperty);
// Route to delete a property by ID
router.route("/property/:id").delete(isAuthenticatedUser, deletePropertyById);
// Route to search properties by title and provinces with pagination
router.route("/properties/all").post(isAuthenticatedUser,searchProperties);
//Route to search property using user preference
router.route("/properties/user").post(isAuthenticatedUser,filterProperties);
//Route to addReview
router.route("/addReview").post(isAuthenticatedUser, authorizeRoles("user"),addReview)
//route to deleteReview 
router.route("/deleteReview").delete(isAuthenticatedUser, authorizeRoles("admin"),deleteReview)
// route to deleteReviewByUser
router.route("/deleteReviewByUser").delete(isAuthenticatedUser, authorizeRoles("user"),deleteReviewByUser)

router.route("/addToWishlist").post(isAuthenticatedUser, addToWishlist)
router.route("/deleteAllWishlist").delete(isAuthenticatedUser,deleteAllWishlistItems)

router.route("/propertyData").get(propertyData)

module.exports = router;