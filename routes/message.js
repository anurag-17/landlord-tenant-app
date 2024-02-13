const express = require('express');
const router = express.Router();
const {
    sendMessage,
    getMessages
} = require("../controllers/message");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

router.route("/send-message/:id").post(isAuthenticatedUser, sendMessage);
router.get("/getMessages/:id").get(isAuthenticatedUser, getMessages);

module.exports = router;