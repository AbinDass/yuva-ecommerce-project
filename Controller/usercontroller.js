// import modules
const db = require("../config/mongooseConnection");
const usersignupdb = require("../Model/userschema/usersuignupmodel");
const productdb = require("../Model/adminscema/product");
const cartdb = require("../Model/userschema/Cart");
const addressdb = require("../Model/userschema/address");
const orderdb = require("../Model/userschema/order");
const wishlistdb = require("../Model/userschema/wishlist");
const categorydb = require("../Model/adminscema/category");
const coupondb = require("../Model/adminscema/coupon");
const bannerdb = require("../Model/adminscema/banner");
// const users = require('../Model/userschema/usersuignupmodel')
const bcrypt = require("bcrypt");
const { sendotp, verifyotp } = require("../utilities/otp");
const { default: mongoose } = require("mongoose");
const { findOneAndUpdate, count, findOne } = require("../Model/userschema/usersuignupmodel");
var { validatePaymentVerification } = require("../node_modules/razorpay/dist/utils/razorpay-utils");
const mailer = require("../config/nodemailer");
const Razorpay = require("razorpay");
const randomstring = require("randomstring");
const cart = require("../Model/userschema/Cart");
const { ObjectID } = require("bson");
const category = require("../Model/adminscema/category");
const product = require("../Model/adminscema/product");

// user logein--------------------------------------
const userLoginview = (req, res) => {
    if (req.session.user_detail) {
        res.redirect("/");
    } else {
        const message = req.session.msg;
        res.render("user/login", { message });
    }
};
let owner;
const userpostlogin = async (req, res) => {
    const { username, password } = req.body;
    console.log(req.body);
    const user = await usersignupdb.findOne({ email: username });
    console.log(user);
    if (user) {
        console.log(req.session.userdetail);
        await bcrypt.compare(password, user.password, (err, data) => {
            console.log("-----------ABINDAS---------------------------");
            console.log(data);
            if (err) throw err;
            else if (data === true) {
                req.session.user_detail = user;
                res.redirect("/");
            } else {
                req.session.msg = "password wrong";
                console.log("data false going to redirect user login");
                res.redirect("/login");
            }
        });
    } else {
        req.session.msg = "wrong username";
        console.log("false usernane");
        res.redirect("/login");
    }
};
const userlogoutview = (req, res) => {
    req.session.destroy();
    res.redirect("/login");
};
// login section ends
// user signup-------------------------------------------
const usersignupview = (req, res) => {
    res.render("user/signup");
};
const postsignupview = async (req, res) => {
    console.log("signuppost is working");
    console.log(req.body);
    const email = req.body.email;
    const hashedpassword = await bcrypt.hash(req.body.password, 10);
    const hashedconfirmpassword = await bcrypt.hash(req.body.confirmpassword, 10);
    const mobilenum = req.body.mobilenumber;
    req.session.signup = req.body;
    const user = await usersignupdb.findOne({ email: email });
    console.log(mobilenum);
    if (user) {
        console.log("exist");
        res.redirect("/");
    } else {
        // userdata = usersignupdb({
        //     fullname: req.body.fullname,
        //     email: req.body.email,
        //     mobilenumber: req.body.mobilenumber,
        //     password: hashedpassword,
        //     confirmpassword: hashedconfirmpassword,
        // });
        // await userdata.save();
        req.session.signup = req.body;
        sendotp(mobilenum);
        res.render("user/otpindex");
    }
};
const postotp = async (req, res) => {
    try {
        console.log(req.session.signup);
        // console.log(req.session.user);
        const { fullname, email, mobilenumber, password, confirmpassword } = req.session.signup;
        console.log(req.session.signup);
        const otp = req.body.otpis;
        console.log(mobilenumber);
        console.log(otp);
        // console.log(req.session.user)
        await verifyotp(mobilenumber, otp).then(async (varification_check) => {
            if (varification_check.status == "approved") {
                console.log(password, confirmpassword);
                const hashedpassword = await bcrypt.hash(password, 10);
                const hashedconfirmpassword = await bcrypt.hash(confirmpassword, 10);
                console.log("otp verifying");
                userdata = usersignupdb({
                    fullname: fullname,
                    email: email,
                    mobilenumber: mobilenumber,
                    password: hashedpassword,
                    confirmpassword: hashedconfirmpassword,
                });
                userdata.save().then((response) => {
                    req.session.user_detail = response;
                });
                req.session.otpverifyed = true;
                res.redirect("/");
            } else {
                req.send("otp error", "otp not match");
            }
        });
    } catch (error) {
        res.redirect('/error')
    }
};
// signup ends
// navigations view
const userhomeview = async (req, res) => {
    user_profile = req.session.user_detail;

    let productlist;
    if (req.query.cat) {
        let cat = req.query.cat;
        console.log(typeof cat);
        try {
            productlist = await productdb.find({ category: cat });
            console.log(productlist, "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww");
            console.log(req.query.cat + "first");
            console.log(productlist.category + "seconds");
        } catch (error) {
            res.redirect('/error')
        }
        typeData.typeListing = "catListing";
    } else if (req.query.q) {
        typeData.typeListing = "qListing";
        typeData.key = req.query.q;
        try {
            const skey = req.query.q;
            console.log(skey);
            productlist = await productdb.find({ _id: skey });
        } catch (error) {
            res.redirect('/error')
        }
    } else {
        productlist = await productdb.find();
    }

    console.log(productlist);
    const allcategory = await categorydb.find();
    const banner = await bannerdb.find();
    //    if(req.session.user_detail){
    //        const userid = req.session.user_detail._id;
    //        const cartitems = await cartdb.findOne({ owner: mongoose.Types.ObjectId(userid) }).populate("items.product");
    //        if( cartitems.items!==null||cartitems.items.length >= 0){
    //            req.session.cartcount = cartitems.items.length
    //            Object.assign(user_profile,{cartcount:  req.session.cartcount})
    //        }
    //    }

    res.render("user/userhome", { productlist, allcategory, user_profile, banner });
};

const shopnow = async (req, res) => {
    user_profile = req.session.user_detail;
    const user = req.session.user_detail;

    const typeData = {
        typeListing: "listing",
        key: null,
    };
    //in the case of checking user have session for wishlist
    if (req.session.user_detail) {
        const userid = req.session.user_detail._id;
        const inwish = await wishlistdb.findOne({ user: userid });
        let wishlist;
        if (inwish) {
            wishlist = inwish.items;
        } else {
            wishlist = [];
        }

        let productlist;
        if (req.query.cat) {
            let cat = req.query.cat;
            console.log(typeof cat);
            try {
                productlist = await productdb.find({ category: cat });
                console.log(productlist, "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww");
                console.log(req.query.cat + "first");
                console.log(productlist.category + "seconds");
            } catch (error) {
                res.redirect('/error')
            }
            typeData.typeListing = "catListing";
        } else if (req.query.q) {
            typeData.typeListing = "qListing";
            typeData.key = req.query.q;
            try {
                const skey = req.query.q;
                console.log(skey);
                productlist = await productdb.find({ _id: skey });
            } catch (error) {
                res.redirect('/error')
            }
        } else if (req.query.inc) {
            productlist = await productdb.find().sort({ price: 1 });
        } else if (req.query.dec) {
            productlist = await productdb.find().sort({ price: -1 });
        } else {
            productlist = await productdb.find();
        }

        console.log(productlist, "ffffffffffffffffffffffffffffffff");
        allcategory = await categorydb.find();

        res.render("user/shop", { productlist, wishlist, allcategory, user, user_profile });
    } else {
        // user havent session and wishlist
        let productlist;
        if (req.query.cat) {
            let cat = req.query.cat;
            console.log(typeof cat);
            try {
                productlist = await productdb.find({ category: cat });
                console.log(productlist, "wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww");
                console.log(req.query.cat + "first");
                console.log(productlist.category + "seconds");
            } catch (error) {
                res.redirect('/error')
            }
            typeData.typeListing = "catListing";
        } else if (req.query.q) {
            typeData.typeListing = "qListing";
            typeData.key = req.query.q;
            try {
                const skey = req.query.q;
                console.log(skey);
                productlist = await productdb.find({ _id: skey });
            } catch (error) {
                res.redirect('/error')
            }
        } else if (req.query.inc) {
            productlist = await productdb.find().sort({ price: 1 });
        } else if (req.query.dec) {
            productlist = await productdb.find().sort({ price: -1 });
        } else {
            productlist = await productdb.find();
        }

        console.log(productlist, "ffffffffffffffffffffffffffffffff");
        allcategory = await categorydb.find();

        res.render("user/shop", { productlist, allcategory, user, user_profile });
    }
};

// serchitems
const searchitems = async (req, res) => {
    try {
        console.log(req.body);
        const sResult = [];
        const skey = req.body.payload;
        const regex = new RegExp("^" + skey + ".*", "i");
        const pros = await productdb.aggregate([
            { $match: { $or: [{ title: regex }, { description: regex }, { brand: regex }] } },
        ]);
        console.log(pros);
        pros.forEach((val, i) => {
            sResult.push({ title: val.title, type: "product", id: val._id });
        });
        const catlist = await categorydb.aggregate([
            { $match: { $or: [{ categoryname: regex }, { description: regex }] } },
        ]);
        console.log(catlist);
        catlist.forEach((val, i) => {
            sResult.push({ title: val.categoryname, type: "category", id: val._id });
        });
        // console.log(sResult.title+'hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii');
        res.send({ payload: sResult });
    } catch (error) {
        res.redirect("/error");
    }
};

const userproductdetailview = async (req, res) => {
    const ID = req.params.id;
    user_profile = req.session.user_detail;
    user = req.session.logedin;
    const product = await productdb.find({ _id: ID });
    res.render("user/product_details", { product, user_profile });
};
const useraboutview = (req, res) => {
    try {
        user_profile = req.session.user_detail;
        res.render("user/useraboutus", { user_profile });
    } catch (error) {
        res.redirect("/error");
    }
};
const usercontactview = (req, res) => {
    user_profile = req.session.user_detail;
    res.render("user/usercontactus", { user_profile });
};
// navs ends
//categoryfinding

const addwishlist = async (req, res) => {
    try {
        console.log(req.body);
        const productid = req.body.productid;

        const userid = req.session.user_detail._id;
        console.log(productid);
        const wishlistexist = await wishlistdb.findOne({ user: userid });
        console.log(wishlistexist);
        if (wishlistexist) {
            const productExist = await wishlistdb.findOne({
                user: userid,
                "items.product": productid,
            });
            if (productExist) {
                res.json({ product: true });
                console.log("uuu");
            } else {
                await wishlistdb.updateOne(
                    { user: userid },
                    {
                        $push: {
                            items: { product: productid },
                        },
                    }
                );
            }
        } else {
            const newwishlist = wishlistdb({ user: userid, items: { product: productid } });
            newwishlist.save();
            console.log("kkk");
        }
    } catch (error) {
        res.redirect('/error')
    }
};

const deletewishlist = async (req, res) => {
    const productid = req.query.productId;
    const userid = req.session.user_detail._id;
    console.log("this is productid", productid);
    console.log(userid);
    await wishlistdb.findOneAndUpdate(
        { user: userid },
        {
            $pull: {
                items: { product: productid },
            },
        }
    );
    res.json();
};

const wishlist = async (req, res) => {
    user_profile = req.session.user_detail;
    userid = req.session.user_detail._id;
    const wishlist = await wishlistdb.findOne({ user: mongoose.Types.ObjectId(userid) }).populate("items.product");
    // const wish = wishlist.items
    console.log(wishlist + "tis is wish list");
    res.render("user/wishlist", { wishlist, user_profile });
};

// user cart -----------------------------------
const getcart = async (req, res) => {
    try {
        user_profile = req.session.user_detail;
        const userid = req.session.user_detail._id;
        const cartitems = await cartdb.findOne({ owner: mongoose.Types.ObjectId(userid) }).populate("items.product");
        const coupens = await coupondb.find({
            available: { $gt: 0 },
        });
        // req.session.cartcount = cartitems.items.length
        // Object.assign(user_profile,{cartcount:  req.session.cartcount})
        console.log("this is the cart", user_profile);
        res.render("user/cart", { cartitems, owner: req.session.user_detail, coupens, userid, user_profile });
    } catch (err) {
        res.redirect("/error");

        console.log(err);
    }
};
const addcart = async (req, res) => {
    const ID = req.params.id;
    const userid = req.session.user_detail._id;
    const product = await productdb.findOne({ _id: ID });
    const user = await cartdb.findOne({ owner: userid });
    if (product.stock <= 0) {
        console.log(product.stock, "skock issssssssssssssssssssssssssssssssssssssssssssssssssssssss");
        // res.send("stock unavailable");
        res.json({ status: false });
    } else {
        res.json({ status: true });
        if (!user) {
            console.log("cart empty");
            const addToCart = await cartdb({
                owner: userid,
                items: [{ product: ID, totalPrice: product.price }],
                cartTotal: product.price,
            });
            await addToCart.save();
            console.log("added successfully");
        } else {
            const productExist = await cartdb.findOne({
                owner: userid,
                "items.product": ID,
            });
            if (productExist !== null) {
                productQuantity = await cartdb.aggregate([
                    {
                        $match: { owner: mongoose.Types.ObjectId(userid) },
                    },
                    {
                        $project: {
                            items: {
                                $filter: {
                                    input: "$items",
                                    cond: {
                                        $eq: ["$$this.product", mongoose.Types.ObjectId(ID)],
                                    },
                                },
                            },
                        },
                    },
                ]);
                console.log(productQuantity);
                const quantity = productQuantity[0].items[0].quantity;
                if (product.stock <= quantity) {
                    console.log("not available");
                } else {
                    await cartdb.findOneAndUpdate(
                        {
                            owner: userid,
                            "items.product": ID,
                        },
                        {
                            $inc: {
                                "items.$.quantity": 1,
                                "items.$.totalPrice": product.price,
                                cartTotal: product.price,
                            },
                        }
                    );
                }
            } else {
                console.log(req.session.user_detail._id);
                console.log(userid);
                const newproductAdd = await cartdb.findOneAndUpdate(
                    { owner: userid },
                    {
                        $push: { items: { product: ID, totalPrice: product.price } },
                        $inc: { cartTotal: product.price },
                    }
                );
                console.log(newproductAdd);
                console.log("hope");
                newproductAdd.save().then(() => {
                    console.log("newproduct added successfully");
                });
            }
        }
    }
};
const deletecart = async (req, res) => {
    try {
        console.log(req.query);
        const user = req.session.user_detail;
        console.log(req.session.user_detail._id);
        const productId = req.query.productId;
        const product = await productdb.findOne({ _id: productId });
        console.log("fsdgsfdg");
        const cart = await cartdb.findOne({ Owner: req.session.user_detail._id });
        const index = await cart.items.findIndex((el) => {
            return el.product == productId;
        });
        const price = cart.items[index].totalPrice;
        const cartTotal = product.price;
        const deletecart = await cartdb.updateOne(
            { Owner: req.session.user_detail._id },
            {
                $pull: {
                    items: { product: productId },
                },
                $inc: { cartTotal: -price },
            }
        );
        console.log(deletecart);

        res.json({ status: true });
    } catch {
        res.redirect('/error')
    }
};
const quantityChange = async (req, res) => {
    userid = req.session.user_detail._id;
    const products = await productdb.findOne({ _id: req.body.productID });
    cartTotal = products.price;
    if (req.body.Count == 1) var product_price = products.price;
    else var product_price = -products.price;

    productQuantity = await cartdb.aggregate([
        {
            $match: { owner: mongoose.Types.ObjectId(userid) },
        },
        {
            $project: {
                items: {
                    $filter: {
                        input: "$items",
                        cond: {
                            $eq: ["$$this.product", mongoose.Types.ObjectId(req.body.productID)],
                        },
                    },
                },
            },
        },
    ]);

    const quantity = productQuantity[0].items[0].quantity;
    console.log(products.stock, quantity + "this");

    if (products.stock <= quantity && req.body.Count == 1) {
        console.log("stock reached");
        res.json({ stock: true });
    } else {
        await cartdb.findOneAndUpdate(
            {
                _id: req.body.cartID,
                "items.product": req.body.productID,
            },
            {
                $inc: {
                    "items.$.quantity": req.body.Count,
                    "items.$.totalPrice": product_price,
                    cartTotal: product_price,
                },
            }
        );
        const data = await cartdb.findOne({
            _id: req.body.cartID,
            "items.product": req.body.productID,
        });
        const index = data.items.findIndex((obj) => obj.product == req.body.productID);
        let qty = data.items[index].quantity;
        totalprice = data.items[index].totalPrice;
        carttotal = data.cartTotal;

        res.json({ qty, totalprice, carttotal });
    }
};
// cart ends
//profile starts -------------------------------------
const profile = async (req, res) => {
    user = req.session.user_detail;
    const userid = req.session.user_detail._id;
    // const finduser = await usersignupdb.findOne({_id:userid})
    const useraddress = await addressdb.findOne({ user: userid }).populate("user");
    // const findaddress
    console.log(useraddress);
    if (useraddress) {
        findaddress = useraddress.address;
        return res.render("user/profile", { useraddress, findaddress, user });
    } else {
        // res.send("please set a profile");
        return res.render("user/profile", { useraddress, user });
    }
};
const addprofile = async (req, res) => {
    // const address = req.body
    console.log("prisdgfgdffffffffffffg", req.body);
    const userid = req.session.user_detail._id;
    const addressexist = await addressdb.findOne({ user: userid });
    console.log("hiiiiiiiiiiiiii this is for checkout");
    if (addressexist) {
        await addressdb.findOneAndUpdate({ userid }, { $push: { address: [req.body] } });
        res.redirect("/profile");
    } else {
        const useraddress = await addressdb({
            user: userid,
            address: [req.body],
        });

        console.log(useraddress);
        useraddress.save().then(() => {
            res.redirect("/profile");
        });
    }
};
const deleteaddress = async (req, res) => {
    const addressid = req.params.id;
    userid = req.session.user_detail._id;
    console.log(userid, "hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
    console.log("hiiiiiiiiiiiiiiiiiiii", addressid);

    await addressdb.updateOne({ user: userid }, { $pull: { address: { _id: addressid } } });
    console.log("hiiiii iam deleting");
    res.json("delete");
};
// checkout  starts ----------------------------------------
const checkout = async (req, res) => {
    try {
        
        console.log(req.path, "fffffffffffffffffffffffffffffffffffffffffffffffff");
        const code = req.query.code;
        const totalaftercoupon = req.query.total;
        let userid = req.session.user_detail._id;
        if (req.query !== {} || req.query !== "" || req.query !== null) {
            if (code !== "") {
                const validcoupen = await coupondb.findOne({ code: code });
                const index = await validcoupen.useduser.findIndex((obj) => obj.users == userid);
                if (index >= 0) {
                    req.flash("error", "you are already used this coupon");
                    // res.json({status:false,message:'coupen already used'})
                } else {
                    userid = mongoose.Types.ObjectId(userid);
                    user = { users: "" };
                    user.users = userid;
                    const usincoupone = await coupondb.findOneAndUpdate({ code: code }, { $addToSet: { useduser: user } });
                    console.log(validcoupen);
                    
                    const updatecart = await cartdb.findOne({ owner: userid });
                    updatecart.cartTotal = totalaftercoupon;
                    await updatecart.save();
                }
            }
        }
        
        const cartdetails = await cartdb.findOne({ owner: mongoose.Types.ObjectId(userid) }).populate("items.product");
        const useraddress = await addressdb.findOne({ user: userid });
        // let address;
        // if (useraddress) {
            const address = useraddress.address;
            //     console.log(address);
            //     const error = req.flash("error");
            //     res.render("user/checkout", { address, cartdetails });
            // } else {
                //     // res.send('sorry')
                //         const error = req.flash("error");
                //         res.render("user/checkout", { address, cartdetails });
                //     }
                //     console.log(cartdetails);
                const error = req.flash("error");
                res.render("user/checkout", { address, cartdetails,error});
            } catch (error) {
                res.redirect('/error')
            }
            }
            
            
            
            const addresscheckout = async (req, res) => {
                console.log(req.body);
                const userid = req.session.user_detail._id;
                await addressdb.findOneAndUpdate({ userid }, { $push: { address: [req.body] } });

    const cartdetails = await cartdb.findOne({ owner: mongoose.Types.ObjectId(userid) }).populate("items.product");
    const useraddress = await addressdb.findOne({ user: userid });
    const address = useraddress.address;
    const error = req.flash("error");
    res.render("user/checkout", { address, cartdetails,error});
    
};






// order starts -----------------------------
// razorpay instance
var instance = new Razorpay({
    key_id: process.env.razor_key_id,
    key_secret: process.env.razor_key_secret,
});
const order = async (req, res) => {
    console.log(req.body);
    const paymod = req.body.paymod;
    const addressindex = req.body.address;
    const userid = req.session.user_detail._id;
    const selectedaddress = await addressdb.findOne({ user: userid });
    const addresss = selectedaddress.address[addressindex];
    const cartitems = await cartdb.findOne({ user: userid }).populate("items.product");

    const products = cartitems.items;
    const carttotal = cartitems.cartTotal;
    //    console.log(products,addresss,cartitems,paymod);
    if (paymod === "COD") {
        const order = await orderdb({
            owner: userid,
            orderitems: products,
            address: addresss,
            ordertotal: carttotal,
            paymentstatus: "payment pending",
            orderstatus: "order placed",
            paymentmethod: paymod,
        });
        order.save().then(async (result) => {
            let order = await orderdb.findOne({ _id: result._id });
            const foundedproduct = order.orderitems;
            foundedproduct.forEach(async (el) => {
                let removestock = await productdb.findOneAndUpdate({ _id: el.product }, { $inc: { stock: -el.quantity } });
            });

            usercart = await cartdb.findOneAndRemove({ user: userid });
            console.log("this is cart of the user", usercart);
            console.log("deleted cart is", usercart);
            res.json({ status: true });
        });
    } else if (paymod === "Razerpay") {
        const orderrazerpay = await orderdb({
            owner: userid,
            orderitems: products,
            address: addresss,
            ordertotal: carttotal,
            paymentstatus: "payment pending",
            orderstatus: "order placed",
            paymentmethod: paymod,
        });
        orderrazerpay.save().then((order) => {
            const userorderdata = order;
            const orderid = order._id;
            console.log("this is user data", userorderdata);

            instance.orders.create(
                {
                    amount: order.ordertotal * 100,
                    currency: "INR",
                    receipt: orderid,
                },
                (err, data) => {
                    console.log("this is data", data);
                    let response = {
                        razorpay: true,
                        orderdata: data,
                        userorderdata: userorderdata,
                    };
                    console.log(response);
                    res.json({ razorpay: true, orderdata: data, userorderdata: userorderdata });
                }
            );
        });
    } else {
        res.json({ payment: false });
    }
};
const paymentverification = async (req, res) => {
    userid = req.session.user_detail._id;
    razorpayOrderId = req.body.razorpayOrderData.razorpay_order_id;
    razorpayPaymentId = req.body.razorpayOrderData.razorpay_payment_id;
    signature = req.body.razorpayOrderData.razorpay_signature;
    secret = process.env.razor_key_secret;
    userdataid = req.body.userorderdata._id;
    // console.log(razorpayOrderId,razorpayPaymentId);
    validate = validatePaymentVerification({ order_id: razorpayOrderId, payment_id: razorpayPaymentId }, signature, secret);
    console.log(validate);
    if (validate) {
        await orderdb
            .findOneAndUpdate(
                { _id: userdataid },
                {
                    $set: {
                        paymentstatus: "payment completed",
                    },
                }
            )
            .then(async (result) => {
                let order = await orderdb.findOne({ _id: result._id });
                const foundedproduct = order.orderitems;
                foundedproduct.forEach(async (el) => {
                    let removestock = await productdb.findOneAndUpdate(
                        { _id: el.product },
                        { $inc: { stock: -el.quantity } }
                    );
                });

                usercart = await cartdb.findOneAndRemove({ user: userid });
                res.json({ status: true });
            });
    } else {
        console.log("order not valid");
    }
};

const couponvalidate = async (req, res) => {
    console.log(req.body);
    let userid = req.body.user;
    const total = parseInt(req.body.total);
    const validcoupen = await coupondb.findOne({ code: req.body.coupencode });

    console.log("redeeeeeeeeeeeeeeeeeeeeeeem", validcoupen);

    if (validcoupen && validcoupen.minimumCartAmount <= total) {
        // const updatecart = await cartdb.findOneAndUpdate({owner:userid},{$set:{appliedCoupon:req.body.coupencode}})
        const redeem = validcoupen.maximumRedeemAmount;
        const redeemedtotal = total - redeem;
        console.log("seeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeroooooooooo", redeemedtotal);
        res.json({ status: true, redeemedtotal });

        // const index = await validcoupen.useduser.findIndex(obj=>obj.users == userid)

        // if(index>=0){

        //     res.json({status:false,message:'coupen already used'})
        // }else{
        //     userid = mongoose.Types.ObjectId(userid)
        //     user = {users:''}
        //     user.users = req.body.user
        //     // const usincouponer = await coupondb.findOneAndUpdate({code:req.body.coupencode},{$addToSet:{useduser:user}})
        //     console.log(validcoupen)
        //     res.json({status:true})
        // }
    } else {
        const message = " minimum amount need OR coupen not valid";
        res.json({ status: false, message });
    }
};
const ordersuccess = async (req, res) => {
    userid = req.session.user_detail._id;
    const orders = await orderdb.find({ owner: userid }).populate("orderitems.product");
    // console.log(orders.orderitems[0],'jjjjjjj');
    const cat = await categorydb.find();
    res.render("user/order", { orders, cat });
};
const orderdetails = async (req, res) => {
    const orderid = req.params.id;
    const orderdetail = await orderdb.findOne({ _id: orderid }).populate("orderitems.product");
    const userid = req.session.user_detail._id;
    const addressid = orderdetail.address.toString();
    const useraddress = await addressdb.findOne({ addressid });

    // const selectedAddress = useraddress.address._id.find(
    //     (el)=> el._id.toString() === addressid
    // )
    const index = useraddress.address.findIndex((obj) => obj._id == addressid);
    const selectedaddress = useraddress.address[index];
    const productdetail = orderdetail.orderitems;
    console.log(orderdetail,'order deetail');
    console.log(orderdetail.orderitems[0].product,'fdfs');
    console.log(productdetail,'pdvcv');
    res.render("user/orderdetails", { orderdetail, selectedaddress, productdetail });
};
const ordercancel = (req, res) => {
    const orderid = req.params.id;
    console.log(orderid);
    orderdb.updateOne({ _id: orderid }, { $set: { orderstatus: "canceled" }, $inc: { stock: 1 } }).then((result) => {
        console.log(result);
    });
    res.redirect("/order-success");
};
// order ends
// forget password ------------------------------------------------------
const forgetpasswordload = async (req, res) => {
    try {
        res.render("user/forget");
    } catch (error) {
        res.redirect('/error')
    }
};
const forgetverify = async (req, res) => {
    try {
        const email = req.body.email;
        console.log(email);
        const userdata = await usersignupdb.findOne({ email: email });
        if (userdata) {
            console.log("und...........................");
            if (userdata.access === false) {
                res.render("user/forget", { message: "email  is  restricted" });
            } else {
                console.log("kerunnund");
                const randomString = await randomstring.generate();
                console.log(randomString);
                const updateddata = await usersignupdb.updateOne({ email: email }, { $set: { token: randomString } });
                console.log(userdata);
                var emails = {
                    to: [email],
                    from: "abindas350@gmail.com",
                    subject: "password reseted",

                    html: `
                  <p>You Requested  a Password reset </p>
                   <p>Click this <a href="http://localhost:3000/reset/${randomString}">link</a> to set a passwor</p>
                `,
                };
                console.log(updateddata + "hiiiiiiiiiiiiiiiiii");
                mailer.sendMail(emails, function (err, res) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(res.response + "email sended");
                    }
                });
            }
        } else {
            res.render("user/forget", { message: "email  is  incorrect" });
        }
    } catch (error) {
        res.redirect('/error')
    }
};
const tokenForm = async (req, res) => {
    token = req.params.token;
    user = await usersignupdb.findOne({ token: token });
    userid = user._id;
    if (user) {
        res.render("user/resetpassword", { userid });
    } else {
        res.send("its not possible");
    }
};
const resetpassword = async (req, res) => {
    console.log(req.body);
    let updateduser;
    // const {password,confirmpassword,userid} = req.body
    const password = req.body.pass;
    const userid = req.body.user;
    console.log(password, userid);
    await usersignupdb
        .findOne({ _id: userid })
        .then((users) => {
            updateduser = users;
            return bcrypt.hash(password, 10);
        })
        .then((hashedpassword) => {
            updateduser.password = hashedpassword;
            updateduser.confirmpassword = hashedpassword;
            updateduser.token = undefined;
            return updateduser.save();
        })
        .then((result) => {
            res.redirect("/login");
        });
};

const error = (req, res) => {
    res.render("user/error");
};
// forget password ends

module.exports = {
    searchitems,

    userLoginview,
    userpostlogin,
    usersignupview,
    userlogoutview,
    postsignupview,
    postotp,

    userhomeview,
    shopnow,
    useraboutview,
    usercontactview,
    userproductdetailview,
    getcart,
    addcart,
    quantityChange,
    profile,
    addprofile,
    deleteaddress,
    checkout,
    addresscheckout,
    deletecart,
    wishlist,
    addwishlist,
    deletewishlist,

    couponvalidate,
    order,
    ordersuccess,
    paymentverification,
    orderdetails,
    ordercancel,

    forgetpasswordload,
    forgetverify,
    tokenForm,
    resetpassword,
    error,
};
