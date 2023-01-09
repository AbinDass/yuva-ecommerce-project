const mongoose = require('mongoose')
const couponSchema = new mongoose.Schema({
    useduser:[{
        users:{
            type:String,
            ref:'user'
        }
    }],
    code:{
        type:String,
        required:true
    },
    available:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        default:'active'
    },
    amount:{
        type:Number,
    },
    maximumRedeemAmount:{
        type:Number,
        required:true
    },
    minimumCartAmount:{
        type:Number,
        required:true
    },
    expiredate:{
        type:Date,
        required:true
    }

},
{
    timestamps:true
})

const coupon = mongoose.model('coupons',couponSchema)
module.exports = coupon 