const express = require('express');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');
const { updateCollegesByStateIds,createCollege, updateCollege, deleteCollege, getAllColleges, getCollegeById, getCollegesByCityId } = require('../controllers/collegeAuth');
const router = express.Router();

router.route("/add").post(isAuthenticatedUser, authorizeRoles("admin"),createCollege)
router.route("/update/:id").put(isAuthenticatedUser, authorizeRoles("admin"),updateCollege)
router.route("/delete/:id").delete(isAuthenticatedUser, authorizeRoles("admin"),deleteCollege)
router.route("/getAll").get(isAuthenticatedUser,getAllColleges)
router.route("/getById/:id").get(isAuthenticatedUser, authorizeRoles("admin"),getCollegeById)
router.route("/getByCity/:cityId").get(isAuthenticatedUser,getCollegesByCityId)


router.route("/updateCollegesByStateIds").put(updateCollegesByStateIds)



module.exports = router;