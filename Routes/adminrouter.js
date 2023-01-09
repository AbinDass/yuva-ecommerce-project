const express = require("express");
const { storeimage } = require("../middlware/multer");
const adminloginCheck = require('../middlware/adminlogincheck')

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
    seeOrders,
    orderView,
    addcoupen,
    coupenadd,
    showCoupons,
    deleteCoupon,
    orderStatusChange,
    Dashboard,
    Banner,
    addbanner,
    showBanner,
    DeleteBanner,
    salesreport,
    monthlyreport,
    Logout,
    yearlyreport,
    changeChart,
} = require("../Controller/admincontroller");

const router = express.Router();

router.get("/", getAdminlogin).post("/adminhome", postAdminlogin);
router.get('/adminhome',Dashboard)
router.get("/finduser",adminloginCheck, finduserview);
router.get("/block/:id", blockuser);
router.get("/unblock/:id", unblockuser);

router.route("/addcategory").get(adminloginCheck,addcategory).post(storeimage, postcategory);
router.get("/listcategory",adminloginCheck, categoryList);
router.get("/editcategory/:id",adminloginCheck, edit_category);
router.post("/editedcategory/:id",adminloginCheck, storeimage, edited_categoery);
router.get("/deletecategory/:id",adminloginCheck, deletecategory);

router.route("/product").get(adminloginCheck,addproducts).post(storeimage, addedProducts);
router.get("/productlist",adminloginCheck, productlist);
router.get("/editproduct/:id",adminloginCheck, editproduct);
router.post("/updateproduct/:id",adminloginCheck, storeimage, updateproduct);
router.get("/deleteproduct/:id",adminloginCheck, deleteproduct);

router.route('/addcoupen')
.get(adminloginCheck,addcoupen)
.post(coupenadd)
router.get('/showcoupons',adminloginCheck,showCoupons)
router.get('/deletecoupon/:id',adminloginCheck,deleteCoupon)

router.route('/addbanner')
.get(adminloginCheck,Banner)
.post(adminloginCheck,storeimage,addbanner)
router.get('/showbanners',adminloginCheck,showBanner)
router.get('/deletebanner/:id',DeleteBanner)

router.get('/orders',adminloginCheck,seeOrders)
router.get('/orderdetail/:id',adminloginCheck,orderView)
router.post('/orderstatus',orderStatusChange)

router.get('/slaesreport',adminloginCheck,salesreport)
router.get('/monthlyreport',adminloginCheck,monthlyreport)
router.get('/yearlyreport',adminloginCheck,yearlyreport)

router.get('/changechart',adminloginCheck,changeChart)

router.get('/logout',Logout)

module.exports = router;
