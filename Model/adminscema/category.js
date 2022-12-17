const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema(
    {
        categoryname : {
            type:String,
            requierd:true
            
        },
        image:{
            type:Array,
             required:true
        
        },
        description:{
            type:String,
            requierd:true,
            max:100
        }
    },
    { timestamps: true }
)

const category = mongoose.model('category',categorySchema)
module.exports = category