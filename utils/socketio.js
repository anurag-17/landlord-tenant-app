const socketIO = require("socket.io");
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const Property = require("../models/Property");
let io;

exports.getReceiverSocketId = (receiverId) => {
	return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId: socketId}

exports.init = (server) => {
  io = socketIO(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    console.log("A user connected",socket.id);

    const userId = socket.handshake.query.userId;
	if (userId != "undefined") userSocketMap[userId] = socket.id;

	// io.emit() is used to send events to all the connected clients
	io.emit("getOnlineUsers", Object.keys(userSocketMap));

	// socket.on() is used to listen to the events. can be used both on client and server side
	socket.on("disconnect", () => {
		console.log("user disconnected", socket.id);
		delete userSocketMap[userId];
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	});
});
};

exports.getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

exports.closeIO = () => {
  if (io) {
    io.close();
  }
};
