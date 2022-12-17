const express = require("express");
const loginCheck = require('../middlware/loginCheck')

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
} = require("../Controller/usercontroller");

const router = express.Router();
// #login
router.route("/login").get(userLoginview).post(userpostlogin);

router.get("/about",loginCheck, useraboutview);
router.get("/contactus", usercontactview);
router.get("/shopnow", shopnow);
router.get("/productdetail/:id",userproductdetailview);
// #userhome
router.get("/", userhomeview);
// #signup
router.route("/signup").get(usersignupview).post(postsignupview);

router.post("/veryfyotp", postotp);
router.get("/logout", userlogoutview);

router.route('/getcart')
.get(loginCheck,getcart)
.patch(quantityChange)

router.post('/cart/:id',loginCheck,addcart)



module.exports = router;
