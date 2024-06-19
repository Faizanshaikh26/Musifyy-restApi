const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_DB, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    maxPoolSize: 10, // Updated from poolSize
    serverSelectionTimeoutMS: 30000, // 30 seconds
    socketTimeoutMS: 45000, // 45 seconds
  })
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
