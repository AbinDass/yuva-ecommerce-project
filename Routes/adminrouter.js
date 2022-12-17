const express = require("express");
const { storeimage } = require("../middlware/multer");

const {
    getAdminlogin,
    postAdminlogin,
    finduserview,
    blockuser,
    unblockuser,
    addcategory,
    postcategory,
    categoryList,
    edit_category,
    edited_categoery,
    deletecategory,
    addproducts,
    addedProducts,
    productlist,
    editproduct,
    updateproduct,
    deleteproduct,
} = require("../Controller/admincontroller");

const router = express.Router();

router.get("/", getAdminlogin).post("/adminhome", postAdminlogin);
router.get("/finduser", finduserview);
router.get("/block/:id", blockuser);
router.get("/unblock/:id", unblockuser);

router.route("/addcategory").get(addcategory).post(storeimage, postcategory);
router.get("/listcategory", categoryList);
router.get("/editcategory/:id", edit_category);
router.post("/editedcategory/:id", storeimage, edited_categoery);
router.get("/deletecategory/:id", deletecategory);

router.route("/product").get(addproducts).post(storeimage, addedProducts);
router.get("/productlist", productlist);
router.get("/editproduct/:id", editproduct);
router.post("/updateproduct/:id", storeimage, updateproduct);

router.get("/deleteproduct/:id", deleteproduct);

module.exports = router;
