const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
    },
    category: {
        type: String,
        ref: "category",
        required: [true, "atleast one category need"],
    },
    image: {
        type: Array,
        required: true,
    },
    description: {
        type: String,
        max: 100,
    },
    discount: {
        type: String,
    },
    size:{
        type:String,
    }
});
const product = mongoose.model('product',productSchema)
module.exports = product
