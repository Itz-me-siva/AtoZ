const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./database/dbconnect");
const app = express();
const productRoutes = require("./routes/azrouter");
const cors = require("cors");

require("dotenv").config();
connectDB();

app.use(cors({ origin: "http://localhost:3001" }));

app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));
app.use("/api", productRoutes);

app.listen(process.env.PORT, () => {
    console.log("Server connected successfully on port:", process.env.PORT);
});