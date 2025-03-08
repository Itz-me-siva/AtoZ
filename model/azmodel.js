const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    quantity:{type: String, required: true},
    stock: { type: String, required: true },
    phone: { type: Number, required: true },
    delivery: { type: String, required: true },
    payment: { type: String, required: true },
    image: { type: String } 
}, { collection: "products" });

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    image: { type: String }
}, { collection: "users" });

const Product = mongoose.model("Product", productSchema);
const User = mongoose.model("User", UserSchema);

module.exports = { Product, User };