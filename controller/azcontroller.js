const Product = require("../model/azmodel");
const fs = require("fs");
const path = require("path");


exports.addProduct = async (req, res) => {
    try {
        const { name, category, price, description } = req.body;
        
        if (!name || !category || !price || !req.file) {
            return res.status(400).json({ error: "Name, category, price, and image are required" });
        }

        const imagePath = req.file.path; 

        const newProduct = new Product({ name, category, price, description, image: imagePath });
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
        const { name, category, price, description } = req.body;

        // Find the existing product
        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        let updatedData = { name, category, price, description };

        // If a new image is uploaded, handle image update
        if (req.file) {
            const newImagePath = req.file.path;

            // Delete old image if it exists
            if (existingProduct.image) {
                const oldImagePath = path.join(__dirname, "..", existingProduct.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            updatedData.image = newImagePath;
        }

        // Update the product in the database
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

