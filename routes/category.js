const express = require("express");
const router = express.Router();

const {
  createCategory,
  updateCategory,
  deleteCategory,
  deleteBulkCategory,
  getCategory,
  getallCategory,
} = require("../controllers/CategoryController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.post("/createCategory", isAuthenticatedUser,authorizeRoles("admin"), createCategory);

router.put("/updateCategory", isAuthenticatedUser,authorizeRoles("admin"), updateCategory);

router.delete("/deleteCategory/:id", isAuthenticatedUser, authorizeRoles("admin"), deleteCategory);

router.post("/deleteBulkCategory", isAuthenticatedUser, authorizeRoles("admin"), deleteBulkCategory);

router.get("/getCategory/:id",isAuthenticatedUser,authorizeRoles("admin"), getCategory);

router.get("/getallCategory",isAuthenticatedUser, getallCategory);

module.exports = router;
