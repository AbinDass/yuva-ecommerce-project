const mongoose = require("mongoose");
const wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "product",
            },        
        }
    ],
});

const wishlist = mongoose.model('wishlist',wishlistSchema)
module.exports = wishlist