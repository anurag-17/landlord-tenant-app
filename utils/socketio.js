const socketIO = require("socket.io");
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const Property = require("../models/Property");
let io;

exports.getReceiverSocketId = (receiverId) => {
	return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId: socketId}



// exports.init = (server) => {
//   io = socketIO(server, { cors: { origin: "*" } });

//   io.on("connection", (socket) => {
//     console.log("A user connected",socket.id);

//     const userId = socket.handshake.query.userId;
// 	if (userId != "undefined") userSocketMap[userId] = socket.id;

// 	// io.emit() is used to send events to all the connected clients
// 	io.emit("getOnlineUsers", Object.keys(userSocketMap));

//   socket.on("typing", () => io.emit("typing"));
//   socket.on("stop typing", () => io.emit("stop typing"));

// 	// socket.on() is used to listen to the events. can be used both on client and server side
// 	socket.on("disconnect", () => {
// 		console.log("user disconnected", socket.id);
// 		delete userSocketMap[userId];
// 		io.emit("getOnlineUsers", Object.keys(userSocketMap));
// 	});

// //   socket.on("disconnect", () => {
// //     console.log("User disconnected", socket.id);
// //     // Remove user from userSocketMap
// //     for (const [key, value] of Object.entries(userSocketMap)) {
// //         if (value === socket.id) {
// //             delete userSocketMap[key];
// //             break;
// //         }
// //     }
// //     // Emit updated online users list
// //     io.emit("getOnlineUsers", Object.keys(userSocketMap));
// // });

  
// });
// };


exports.init = (server) => {
  io = socketIO(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
      console.log("A user connected", socket.id);

      const userId = socket.handshake.query.userId;
      const propertyId = socket.handshake.query.propertyId;

      if (userId && propertyId) {
          // Store socket ID with both user ID and property ID
          if (!userSocketMap[propertyId]) {
              userSocketMap[propertyId] = {};
          }
          userSocketMap[propertyId][userId] = socket.id;
      }

      // Emit online users for each property
      for (const propId in userSocketMap) {
          io.to(propId).emit("getOnlineUsers", Object.keys(userSocketMap[propId]));
      }

      socket.on("typing", () => io.emit("typing"));
      socket.on("stop typing", () => io.emit("stop typing"));

      socket.on("disconnect", () => {
          console.log("User disconnected", socket.id);
          // Remove user from userSocketMap based on property ID and user ID
          for (const propId in userSocketMap) {
              if (userSocketMap[propId][userId] === socket.id) {
                  delete userSocketMap[propId][userId];
                  break;
              }
          }
          // Emit updated online users list for each property
          for (const propId in userSocketMap) {
              io.to(propId).emit("getOnlineUsers", Object.keys(userSocketMap[propId]));
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
