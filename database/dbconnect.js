const mongoose = require("mongoose");

const mongoURI = "mongodb+srv://itzmesiva934:mongo934@cluster0.8hjsq.mongodb.net/AtoZ";  

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            family: 4
        });
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed: ", error);
        process.exit(1);
    }
};

module.exports = connectDB;
