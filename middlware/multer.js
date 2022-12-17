const express = require("express");
const path = require("path");
const multer = require("multer");

// const upload = multer({dest:'/uploaded_images'})

const categorystorage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, "public/admin/uploads");
    },

    filename: (req, file, cb) => {
        // cb(null,'category-'+Date.now() + path.extname(file.originalname))
        cb(null, "image-" + Date.now() + " " + file.originalname);
    },
});

const categoryimageupload = multer({
    storage: categorystorage,
});

const storeimage = categoryimageupload.array("image", 3);

module.exports = { storeimage };
