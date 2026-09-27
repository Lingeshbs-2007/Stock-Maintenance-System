const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true,
        unique: true
    },

    productName: {
        type: String,
        required: true,
        trim: true
    },

    category: {
        type: String,
        required: true,
        trim: true
    },

    supplier: {
        type: String,
        required: true,
        trim: true
    },

    quantity: {
        type: Number,
        required: true,
        min: 0
    },

    price: {
        type: Number,
        required: true,
        min: 0
    },

    stockStatus: {
        type: String,
        required: true,
        enum: ["In Stock", "Low Stock", "Out of Stock"]
    },

    dateAdded: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Product", productSchema);