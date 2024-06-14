const mongoose = require("mongoose");

// const connectDB = async () => {
//   // await mongoose.connect(process.env.MONGO_URI);
//   // console.log(process.env.MONGO_URI);
//   console.log("MongoDB Connected");
// };

// module.exports = connectDB;



const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected");

    // Handling connection events
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to DB');
    });

    mongoose.connection.on('error', (err) => {
      console.error(`Mongoose connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected');
    });

    // Close Mongoose connection when Node process ends
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('Mongoose connection closed on app termination');
      process.exit(0);
    });
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;