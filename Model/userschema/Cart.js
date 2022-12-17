const mongoose = require('mongoose')
const cartSchema = new mongoose.Schema({
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    items:[{
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"product"
        },
        quantity:{
            type:Number,
            default:1
        },
        totalPrice:{
            type:Number,
            default:1
        },
        date:{
            type:Date,
            defualt:Date.now
        }
    }],
    cartTotal:{
        type:Number,
        defualt:0
    }
})

const cart = mongoose.model("shopingcart",cartSchema)
module.exports = cart