const express = require('express');
const router = express.Router();
const {
    sendMessage,
    getMessages,
    deleteAllMessages,
    inbox
} = require("../controllers/message");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.route("/send-message/:id").post(isAuthenticatedUser, sendMessage);
router.route("/getMessages/:id/:propertyId").get(isAuthenticatedUser, getMessages);
router.route('/deleteAllMessages/:receiverId/:propertyId').delete(isAuthenticatedUser,deleteAllMessages);
router.route('/inbox').get(isAuthenticatedUser, inbox)

module.exports = router;