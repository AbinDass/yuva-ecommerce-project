const mongoose = require('mongoose')
const addressSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    address:[{
        name:{
            type:String,
            max:20
        },
        phone:{
            type:Number
        },
        state:{
            type:String
        },
        city:{
            type:String
        },
        address:{
            type:String
        },
        pin:{
            type:Number
        }
    }]
})

const address = mongoose.model('address',addressSchema)
module.exports = address
