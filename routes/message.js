const express = require('express');
const router = express.Router();
const {
    sendMessage,
    getMessages,
    deleteAllMessages
} = require("../controllers/message");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.route("/send-message/:id").post(isAuthenticatedUser, sendMessage);
router.route("/getMessages/:id/:propertyId").get(isAuthenticatedUser, getMessages);
router.route('/deleteAllMessages/:receiverId/:propertyId').delete(isAuthenticatedUser,deleteAllMessages);


module.exports = router;