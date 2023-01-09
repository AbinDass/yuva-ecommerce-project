const mongoose = require('mongoose')
const bannerSchema = new mongoose.Schema({
    subHeading:{
        type:String
    },
    mainHeading:{
        type:String
    },
    description:{
        type:String
    },
    bannerType:{
       type:String
    },
    url:{
        type:String
    },
    image:{
        type:Array
    }
},{timestamps:true})

const banner = mongoose.model('banner',bannerSchema)

module.exports = banner