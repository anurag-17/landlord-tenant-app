const Message = require("../models/Message");
const Conversation = require("../models/Conversation")
const { getReceiverSocketId, io } = require("../utils/socketio.js");

exports.sendMessage = async (req, res) => {
  try {
    const { message, propertyId } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      propertyId,
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        propertyId,
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
      propertyId,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

// await conversation.save();
// await newMessage.save();

    // this will run in parallel
    await Promise.all([conversation.save(), newMessage.save()]);

    // SOCKET IO FUNCTIONALITY WILL GO HERE
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      // io.to(<socket_id>).emit() used to send events to specific client
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json({success: true,newMessage});
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({success: false, error: "Internal server error" });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { id: userToChatId, propertyId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      propertyId,
      participants: { $all: [senderId, userToChatId] },
    }).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES

    if (!conversation) return res.status(200).json([]);

    const messages = conversation.messages;

    res.status(200).json({success: true,messages});
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({success: false, error: "Internal server error" });
  }
};
exports.deleteAllMessages = async (req, res) => {
  try {
    const { propertyId } = req.params; // Assuming propertyId is used to identify the conversation
    const senderId = req.user._id; // Sender ID from authenticated user
    const receiverId = req.params.receiverId; // Receiver ID from URL params

    // Find the conversation
    const conversation = await Conversation.findOne({
      propertyId,
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }

    // Delete messages associated with the conversation
    await Message.deleteMany({
      _id: { $in: conversation.messages }
    });

    // Optionally, you might want to remove the message references from the conversation document as well
    conversation.messages = [];
    await conversation.save();

    res.status(200).json({ success: true, message: "All messages deleted" });
  } catch (error) {
    console.error("Error in deleteAllMessages controller: ", error.message);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
