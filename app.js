const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./database/dbconnect");
const productRoutes = require("./routes/azrouter");

require("dotenv").config();
connectDB();

const app = express();
app.use(bodyParser.json());

app.use("/uploads", express.static("uploads"));

app.use("/products", productRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
