const {Product, User} = require("../model/azmodel");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const jwt=require("jsonwebtoken")

exports.Signup = async (req, res) => {
    try {
        console.log("Request Body:", req.body);

        const { name, age, email, phone, password } = req.body;
        if (!name || !age || !email || !phone || !password) {
            return res.status(400).send("Please fill all the fields");
        }

        const image = req.file ? req.file.filename : null; 
        const newUser = await User.create({ name, age, email, phone, password, image });

        if (!newUser) {
            return res.status(400).json({ Message: "Signup failed" });
        }

        res.status(200).json({
            Message: "Signup successful",
            data: newUser
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ Message: "All fields are required" });
        }

        const user = await User.findOne({ email });  
        console.log("User:", user);
        
        if (!user) {
            return res.status(400).json({ Message: "user not found" });
        }

        if (user.password !== password) {  
            return res.status(400).json({ Message: "Incorrect password" });
        }

        const token = jwt.sign({ UserId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h"
        });

        res.status(200).json({
            Message: "Login successful",
            data: user,
            token
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.Auth = async (req, res) => {

    res.status(200).json({ Message: "Access granted", user: req.user });
    
};

exports.addProduct = async (req, res) => {
    try {
        const { name, category, price, description,quantity,stock,phone, delivery, payment } = req.body;
        
        if (!name || !category || !price || !req.file) {
            return res.status(400).json({ error: "Name, category, price, and image are required" });
        }

        const imagePath = req.file.path; 

        const newProduct = new Product({ name, category, price, description,quantity,stock,phone,delivery, payment, image: imagePath });
        await newProduct.save();

        res.status(201).json({ message: "Product added successfully", product: newProduct });
    } catch (error) {
        res.status(500).json({ error: "Error adding product" });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ message: "Products fetched successfully", data: products });
    } catch (error) {
        res.status(500).json({ error: "Error fetching products" });
    }
};

exports.getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const products = await Product.find({ category });

        if (products.length === 0) {
            return res.status(404).json({ error: "No products found in this category" });
        }

        res.status(200).json({ message: "Products fetched successfully", data: products });
    } catch (error) {
        res.status(500).json({ error: "Error fetching products" });
    }
};

exports.filterByPrice = async (req, res) => {
    try {
        const { maxPrice, category } = req.query;

        if (!maxPrice || !category) {
            return res.status(400).json({ error: "Both category and maxPrice are required" });
        }

        const filteredProducts = await Product.find({
            category: category,
            price: { $lte: maxPrice }  
        });

        if (filteredProducts.length === 0) {
            return res.status(404).json({ error: "No products found in this category under the specified price" });
        }

        res.status(200).json({
            message: `Products under ₹${maxPrice} in ${category} category`,
            data: filteredProducts
        });

    } catch (error) {
        res.status(500).json({ error: "Error fetching products" });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, price, description,quantity,stock,phone, delivery, payment } = req.body;

        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        let updatedData = { name, category, price, description,quantity,stock,phone, delivery, payment };

        if (req.file) {
            const newImagePath = req.file.path;

            if (existingProduct.image) {
                const oldImagePath = path.join(__dirname, "..", existingProduct.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            updatedData.image = newImagePath;
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });

        res.status(200).json({ message: "Product updated successfully", product: updatedProduct });

    } catch (error) {
        console.error("Update Product Error:", error);
        res.status(500).json({ error: error.message || "Error updating product" });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        if (product.image) {
            const imagePath = path.join(__dirname, "..", product.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await Product.findByIdAndDelete(id);
        res.status(200).json({ message: "Product deleted successfully" });

    } catch (error) {
        res.status(500).json({ error: "Error deleting product" });
    }
};
exports.updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, age, email, phone, password } = req.body;

        const existingUser = await User.findById(id);
        if (!existingUser) {
            return res.status(404).json({ error: "User not found" });
        }

        let updatedData = { name, age, email, phone };

        if (password) { 
            updatedData.password = password; 
        }

        const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true });

        res.status(200).json({ message: "Profile updated successfully", updatedUser });

    } catch (error) {
        console.error("Update Profile Error:", error);
        res.status(500).json({ error: error.message || "Error updating profile" });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const customer = await User.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: "user not found" });
        }
        res.json(customer);
    } catch (error) {
        res.status(500).json({ message: "Error fetching profile", error });
    }
};

