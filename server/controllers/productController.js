const Product = require("../models/Product");

// Add Product
const addProduct = async (req, res) => {
    try {
        const { productName, category, supplier, quantity, price } = req.body;

        // Basic Validation
        if (!productName || !category || !supplier || quantity == null || price == null) {
            return res.status(400).json({
                message: "All fields are required."
            });
        }

        if (quantity < 0 || price < 0) {
            return res.status(400).json({
                message: "Quantity and Price cannot be negative."
            });
        }

        // Generate Product ID
       // Generate Product ID
const lastProduct = await Product.findOne().sort({ productId: -1 });

let productId = "P1001";

if (lastProduct) {
    const lastNumber = parseInt(lastProduct.productId.substring(1));
    productId = `P${lastNumber + 1}`;
}
        // Calculate Stock Status
        let stockStatus;

        if (quantity === 0) {
            stockStatus = "Out of Stock";
        } else if (quantity <= 10) {
            stockStatus = "Low Stock";
        } else {
            stockStatus = "In Stock";
        }

        // Create Product
        const product = new Product({
            productId,
            productName,
            category,
            supplier,
            quantity,
            price,
            stockStatus
        });

        // Save to MongoDB
        await product.save();

        res.status(201).json({
            message: "Product Added Successfully",
            product
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
// Get All Products
const getProducts = async (req, res) => {
    try {

        const products = await Product.find().sort({ dateAdded: -1 });

        res.status(200).json(products);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};
// Update Product
const updateProduct = async (req, res) => {
    try {

        const { id } = req.params;
        const { productName, category, supplier, quantity, price } = req.body;

        // Validation
        if (!productName || !category || !supplier || quantity == null || price == null) {
            return res.status(400).json({
                message: "All fields are required."
            });
        }

        if (quantity < 0 || price < 0) {
            return res.status(400).json({
                message: "Quantity and Price cannot be negative."
            });
        }

        // Calculate Stock Status
        let stockStatus;

        if (quantity === 0) {
            stockStatus = "Out of Stock";
        } else if (quantity <= 10) {
            stockStatus = "Low Stock";
        } else {
            stockStatus = "In Stock";
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
                productName,
                category,
                supplier,
                quantity,
                price,
                stockStatus
            },
            {
    returnDocument: "after",
    runValidators: true
}
        );

        if (!updatedProduct) {
            return res.status(404).json({
                message: "Product not found."
            });
        }

        res.status(200).json({
            message: "Product Updated Successfully",
            product: updatedProduct
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};
// Delete Product
const deleteProduct = async (req, res) => {
    try {

        const { id } = req.params;

        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({
                message: "Product not found."
            });
        }

        res.status(200).json({
            message: "Product Deleted Successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};
module.exports = {
    addProduct,
    getProducts,
    updateProduct,
    deleteProduct
};