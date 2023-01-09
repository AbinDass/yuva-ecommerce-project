const express = require("express");
const loginCheck = require("../middlware/loginCheck");

const {
    userLoginview,
    useraboutview,
    usercontactview,
    usersignupview,
    userhomeview,
    postsignupview,
    postotp,
    userpostlogin,
    shopnow,
    userproductdetailview,
    userlogoutview,
    getcart,
    addcart,
    quantityChange,
    profile,
    addprofile,
    deleteaddress,
    checkout,
    addresscheckout,
    deletecart,
    order,
    ordersuccess,
    paymentverification,
    forgetpasswordload,
    forgetverify,
    orderdetails,
    tokenForm,
    resetpassword,
    ordercancel,
    wishlist,
    addwishlist,
    deletewishlist,
    error,
    couponvalidate,
    searchitems,


} = require("../Controller/usercontroller");

const router = express.Router();
//search
router.post('/search',searchitems)
// #login
router.route("/login").get(userLoginview).post(userpostlogin);
router.get("/about", useraboutview);
router.get("/contactus", usercontactview);
router.get("/shopnow", shopnow);
router.get("/productdetail/:id", userproductdetailview);
// #userhome
router.get("/", userhomeview);
// #signup
router.route("/signup")
.get(usersignupview)
.post(postsignupview)
router.post("/veryfyotp", postotp);

//wishlist 
router.route('/wishlist')
.get(loginCheck,wishlist)
.post(addwishlist)
.delete(deletewishlist)

// cart
router.route("/getcart").get(loginCheck, getcart).patch(loginCheck, quantityChange);
router.post("/cart/:id", loginCheck, addcart);
router.delete('/deletecart',loginCheck,deletecart)
// profile
router.route('/profile')
.get(loginCheck,profile)
router.post('/addprofile',loginCheck,addprofile)
router.delete('/deleteaddress/:id',loginCheck,deleteaddress)
// checkout and order
router.get("/checkout",checkout)
router.post('/addresscheckout',addresscheckout)
// order
router.post('/payment',order)
router.get('/order-success',ordersuccess)
router.post('/verifypayment',paymentverification)
router.get('/order-detail/:id',orderdetails)
router.get('/order-cancel/:id',ordercancel)
//categoryget
// forgetpassword
router.route('/forgetpassword')
.get(forgetpasswordload)
.post(forgetverify)
router.get('/reset/:token',tokenForm)
router.post('/reset',resetpassword)
//coupen
router.post('/couponcheckot',loginCheck,couponvalidate)
//error page 
router.get('/error',error)
// logout
router.get("/logout", userlogoutview);

module.exports = router;
