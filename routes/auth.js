const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  register,
  login,
  adminLogin,
  logout,
  forgotPassword,
  resetPassword,
  getAllUser,
  getaUser,
  getUserById,
  deleteUser,
  updatedUser,
  updatePassword,
  uploadImage,
  verifyUser,
  graphData,
  userData,
  updateAdminEmail,
  checkUserByProviderID
} = require("../controllers/auth");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


router.route("/login").post(login);
router.route("/checkUser/:provider_ID/:email").get(checkUserByProviderID)

router.route("/adminLogin").post(adminLogin);

router.route("/logout").get(isAuthenticatedUser, logout);

router.route("/verifyUserToken/:token").get(verifyUser)

// Create User
router.route("/register").post(register);

// Update User Password
router.post("/updatePassword", isAuthenticatedUser, updatePassword);
router.post("/updateAdminEmail", isAuthenticatedUser, updateAdminEmail);
// Update User updateAdminEmail
router.put("/edit-user/:id", isAuthenticatedUser, updatedUser);

// Get all Users
router.route("/all-users").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUser);

// Get a User
router.route("/getaUser").get(isAuthenticatedUser, getaUser);

// Get user by ID 
router.route("/getUserById/:id").get(isAuthenticatedUser, getUserById);

// Delete a user
router.delete("/deleteaUser/:id",isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

router.route("/forgotpassword").post(forgotPassword);
router.route("/resetpassword/:resetToken").put(resetPassword);

router.route("/graphData").get(graphData);

router.route("/userData").get(userData);

router.route("/uploadImage").post(isAuthenticatedUser, upload.single('file'),uploadImage)

module.exports = router;