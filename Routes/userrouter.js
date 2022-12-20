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
    logout,
    addprofile,
    deleteaddress,
    checkout,
    addresscheckout,
} = require("../Controller/usercontroller");

const router = express.Router();
// #login
router.route("/login").get(userLoginview).post(userpostlogin);
router.get("/about", useraboutview);
router.get("/contactus", usercontactview);
router.get("/shopnow", shopnow);
router.get("/productdetail/:id", userproductdetailview);
// #userhome
router.get("/", userhomeview);
// #signup
router.route("/signup").get(usersignupview).post(postsignupview);
router.post("/veryfyotp", postotp);
router.get("/logout", loginCheck, userlogoutview);
// #cart
router.route("/getcart").get(loginCheck, getcart).patch(loginCheck, quantityChange);
router.post("/cart/:id", loginCheck, addcart);
// profile
router.route('/profile')
.get(profile)
router.post('/addprofile',addprofile)
router.delete('/deleteaddress/:id',deleteaddress)
// checkout and order
router.get("/checkout",checkout)
router.post('/addresscheckout',addresscheckout)
// logout
router.get('/logout',logout)

module.exports = router;
