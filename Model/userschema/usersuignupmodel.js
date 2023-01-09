const mongoose = require("mongoose");

const usersignupschema = new mongoose.Schema(
    {
        fullname: String,
        email: {
            type: String,
            unique: true,
        },
        mobilenumber: {
            type: Number,
        },
        address: {
            type: String,
            max: 100,
        },
        DOB: Date,
        password: {
            type: String,
            max: 8,
        },
        confirmpassword: {
            type: String,
            max: 8,
        },
        access: {
            type: Boolean,
            default: true,
        },
        token:{
            type:String,
            default:''
        }
    },
    { timestamps: true }
);

const users = mongoose.model("user", usersignupschema);
module.exports = users;
