const socketIO = require("socket.io");
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const Property = require("../models/Property");
let io;

exports.getReceiverSocketId = (propertyId, receiverId) => {
  if (userSocketMap[propertyId] && userSocketMap[propertyId][receiverId]) {
      console.log(`Retrieving socket IDs for receiverId: ${receiverId} under propertyId: ${propertyId}`, userSocketMap[propertyId][receiverId]);
      return userSocketMap[propertyId][receiverId];
  }
  return [];
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

  socket.on("typing", () => io.emit("typing"));
  socket.on("stop typing", () => io.emit("stop typing"));

	// socket.on() is used to listen to the events. can be used both on client and server side
	socket.on("disconnect", () => {
		console.log("user disconnected", socket.id);
		delete userSocketMap[userId];
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	});

//   socket.on("disconnect", () => {
//     console.log("User disconnected", socket.id);
//     // Remove user from userSocketMap
//     for (const [key, value] of Object.entries(userSocketMap)) {
//         if (value === socket.id) {
//             delete userSocketMap[key];
//             break;
//         }
//     }
//     // Emit updated online users list
//     io.emit("getOnlineUsers", Object.keys(userSocketMap));
// });

  
});
};


exports.init = (server) => {
  io = socketIO(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);
    const userId = socket.handshake.query.userId;
    const propertyId = socket.handshake.query.propertyId;
    console.log("socketuser", {userId, propertyId})
    if (userId !== "undefined" && propertyId) {
        if (!userSocketMap[propertyId]) {
            userSocketMap[propertyId] = {};
        }

        if (!userSocketMap[propertyId][userId]) {
            userSocketMap[propertyId][userId] = [];
        }

        userSocketMap[propertyId][userId].push(socket.id);
        console.log(`Socket ID ${socket.id} added for user ${userId} under property ${propertyId}`);
    }

    socket.on("disconnect", () => {
        if (userSocketMap[propertyId] && userSocketMap[propertyId][userId]) {
            const index = userSocketMap[propertyId][userId].indexOf(socket.id);
            if (index !== -1) {
                userSocketMap[propertyId][userId].splice(index, 1);
                console.log(`Socket ID ${socket.id} removed from user ${userId} under property ${propertyId}`);
            }

            if (userSocketMap[propertyId][userId].length === 0) {
                delete userSocketMap[propertyId][userId];
                if (Object.keys(userSocketMap[propertyId]).length === 0) {
                    delete userSocketMap[propertyId];
                }
            }
        }
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
