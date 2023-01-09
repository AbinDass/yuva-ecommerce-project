const mongoose = require('mongoose')
const orderSchema =  new mongoose.Schema({
owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'user'
},
orderitems:[
    {
        product:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'product'
        },
        quantity:{
            type:Number,
            default:1
        },
        totalPrice:{
            type:Number,
            defualt:0
        }
    }
],
address:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'address'
},
ordertotal:{
    type:Number
},
paymentmethod:String,
paymentstatus:String,
orderstatus:{
    type:String,
    defualt:''
},
orderdate:{
    type:Date,
    default:Date.now
}
},
{
    timestamps:true
})

const order = mongoose.model('order',orderSchema)
module.exports = order