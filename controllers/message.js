const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const { getReceiverSocketId, getIO } = require("../utils/socketio.js");
const { default: mongoose } = require("mongoose");

exports.sendMessage = async (req, res) => {
  try {
      const io = getIO();
      const { message, propertyId, file, filetype } = req.body;
      const { id: receiverId } = req.params;
      const senderId = req.user._id;
      // console.log({propertyId, senderId:senderId?.toString(),receiverId, message, file, filetype});
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

      // Check if the receiver is currently online
      const receiverSocketIds = getReceiverSocketId(propertyId, receiverId);
      const isReceiverOnline = receiverSocketIds && receiverSocketIds.length > 0;

      const newMessage = new Message({
          senderId,
          receiverId,
          message,
          file,
          filetype,
          propertyId,
          isRead: isReceiverOnline // Set isRead based on the online status of the receiver
      });

      if (newMessage) {
          conversation.messages.push(newMessage._id);
      }

      // Save both conversation and new message documents in parallel
      await Promise.all([conversation.save(), newMessage.save()]);
      const senderSocketIds = getReceiverSocketId(propertyId, senderId?.toString());
      const isSenderOnline = senderSocketIds && senderSocketIds.length > 0;
      if (isSenderOnline) {
        senderSocketIds.forEach(socketId => {
          io.to(socketId).emit("sentMessage", newMessage);
      });
      }
      // console.log("isSenderOnline", senderSocketIds);
      // console.log("receiverSocketIds", receiverSocketIds);
      if (isReceiverOnline) {
          // Emit the message to all sockets associated with the receiver under the specific property
          receiverSocketIds.forEach(socketId => {
              io.to(socketId).emit("newMessage", newMessage);
          });
      }
      

      res.status(201).json({ success: true, newMessage });
  } catch (error) {
      console.log("Error in sendMessage controller: ", error.message);
      res.status(500).json({ success: false, error: "Internal server error" });
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
    // Update isRead to true for unread messages
    await Message.updateMany(
      { _id: { $in: messages.map((msg) => msg._id) }, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({ success: true, messages });
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ success: false, error: "Internal server error" });
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
      return res
        .status(404)
        .json({ success: false, message: "Conversation not found" });
    }

    // Delete messages associated with the conversation
    await Message.deleteMany({
      _id: { $in: conversation.messages },
    });

    // Optionally, you might want to remove the message references from the conversation document as well
    conversation.messages = [];
    await conversation.save();
    // Delete the conversation itself
    await Conversation.deleteOne({ _id: conversation._id });

    res.status(200).json({
      success: true,
      message: "Conversation and all messages deleted",
    });
  } catch (error) {
    console.error("Error in deleteAllMessages controller: ", error.message);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};
exports.deleteAllConversations = async (req, res) => {
  try {
    const userId = req.user._id; // User ID from authenticated user

    // Find all conversations where the user is a participant
    const conversations = await Conversation.find({
      participants: userId,
    });

    if (!conversations || conversations.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No conversations found for the user",
      });
    }

    // Extract message IDs from all conversations
    const messageIds = conversations.flatMap(
      (conversation) => conversation.messages
    );
    // console.log(messageIds);
    // Delete messages associated with the conversations
    await Message.deleteMany({
      _id: { $in: messageIds },
    });
    const conversationIds = conversations.map(
      (conversation) => conversation._id
    );
    // Delete messages associated with the conversations
    // await Message.deleteMany({ conversationId: { $in: conversationIds } });
    // Delete messages associated with the conversation
    // await Message.deleteMany({
    //   _id: { $in: conversationMessage },
    // });

    // Delete the conversations themselves
    await Conversation.deleteMany({ _id: { $in: conversationIds } });

    res.status(200).json({
      success: true,
      message: "All conversations and their messages deleted for the user",
    });
  } catch (error) {
    console.error(
      "Error in deleteAllConversations controller: ",
      error.message
    );
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

exports.inbox = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id); // Correct usage of ObjectId

    // Find conversations where the user is a participant
    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate({
        path: "messages",
        options: { sort: { createdAt: -1 } }, // Sort messages by newest first
        populate: { path: "senderId", select: "fullname" },
        populate: { path: "receiverId", select: "fullname" }, // Assuming you want to show the sender's name
      })
      .populate({
        path: "participants", // Path to the field you want to populate
        select: "fullname profilePicture", // Fields to include from the populated documents
      })
      .populate("propertyId", "title") // Populate property details, adjust fields as necessary
      .sort({ updatedAt: -1 }); // Sort conversations by the most recently updated

    // Transform conversations to prepare the inbox data
    const inbox = await Promise.all(conversations.map(async (conv) => {
      const lastMessage = conv.messages[0]
        ? conv.messages[0].message
        : "No messages";
      const otherParticipantId = conv.participants.find(
        (participant) => !participant.equals(userId)
      ); // Corrected participant comparison

      // Count unread messages
      const unreadCount = conv.messages.filter(msg => msg.senderId != userId && !msg.isRead).length;

      return {
        conversationId: conv._id,
        lastMessage,
        propertyTitle: conv.propertyId?.title,
        propertyId: conv?.propertyId?._id,
        otherParticipantId,
        updatedAt: conv.updatedAt,
        unreadCount,
      };
    }));

    res.status(200).json({ success: true, inbox });
  } catch (error) {
    console.log("Error in inbox controller: ", error.message);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

