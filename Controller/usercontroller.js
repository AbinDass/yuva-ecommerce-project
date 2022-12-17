// import modules here
const db = require("../config/mongooseConnection");
const usersignupdb = require("../Model/userschema/usersuignupmodel");
const productdb = require("../Model/adminscema/product");
const cartdb = require("../Model/userschema/Cart");
const bcrypt = require("bcrypt");
// const users = require('../Model/userschema/usersuignupmodel')
const { sendotp, verifyotp } = require("../utilities/otp");
const { default: mongoose } = require("mongoose");
const product = require("../Model/adminscema/product");
const { findOneAndUpdate, count } = require("../Model/userschema/usersuignupmodel");

const userhomeview = (req, res) => {
    console.log(req.session.user);
    // let user = req.session.user
    res.render("user/userhome");
};

const userLoginview = (req, res) => {
    res.render("user/login");
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
                // if(user.access == true){
                // req.session.userdetail
                req.session.user_detail = user;
                //     res.redirect('/')
                // }
                // else{
                //     res.send('acces denied')
                // }
                console.log(
                    "-----------ABINDASgghfjgsdhfglugfhrgfrtfyuegferuy8heuihggfggsdghyhf---------------------------"
                );
                res.redirect("/");
            } else {
                console.log("data false going to redirect user login");
                res.redirect("/login");
            }
        });
    } else {
        console.log("false usernane");
        res.redirect("/login");
    }
};

const shopnow = async (req, res) => {
    console.log(req.session.user);
    const product = await productdb.find();
    console.log(product);
    res.render("user/shop", { product });
};

const userproductdetailview = async (req, res) => {
    const ID = req.params.id;
    user = req.session.logedin;
    const product = await productdb.find({ _id: ID });
    // console.log(product);
    res.render("user/product_details", { product });
};

const useraboutview = (req, res) => {
    res.render("user/useraboutus");
};

const usercontactview = (req, res) => {
    res.render("user/usercontactus");
};

// get user signup page----------------------------------
const usersignupview = (req, res) => {
    res.render("user/signup");
};
// post user signup page-------------------------------

const postsignupview = async (req, res) => {
    console.log("signuppost is working");
    console.log(req.body);
    const email = req.body.email;
    const hashedpassword = await bcrypt.hash(req.body.password, 10);
    const hashedconfirmpassword = await bcrypt.hash(req.body.confirmpassword, 10);
    const mobilenum = req.body.mobilenumber;

    // taking here user iunder session
    req.session.signup = req.body;

    console.log(req.session.signup);
    const user = await usersignupdb.findOne({ email: email });
    if (user) {
        console.log("exist");
        res.redirect("/");
    } else {
        // userdata = usersignupdb({
        //     fullname:req.body.fullname,
        //     email:req.body.email,
        //     mobilenumber:req.body.mobilenumber,
        //     password:hashedpassword,
        //     confirmpassword:hashedconfirmpassword,
        // })
        // await userdata.save()

        // req.session.signup = req.body;

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
                    // owner = response
                });

                req.session.otpverifyed = true;
                res.redirect("/");
            } else {
                req.send("otp error", "otp not match");
            }
        });
    } catch (error) {
        console.log(error);
    }
};

const userlogoutview = (req, res) => {
    req.session.destroy();
    res.redirect("/login");
};

const getcart = async (req, res) => {
    try {
        const userid = req.session.user_detail._id;
        const cartitems = await cartdb.findOne({ owner: mongoose.Types.ObjectId(userid) }).populate("items.product");
        res.render("user/cart", { cartitems, owner: req.session.user_detail });
        console.log("---------------", cartitems);
        console.log(cartitems.quantity);
        // console.log(req.session.user_detail);
        // console.log(userid);
    } catch (err) {
        console.log(err);
    }
};

const addcart = async (req, res) => {
    const ID = req.params.id;
    console.log("id is", ID);
    console.log(req.session.user_detail);
    const userid = req.session.user_detail._id;
    //    console.log(userid);

    const product = await productdb.findOne({ _id: ID });
    const user = await cartdb.findOne({ owner: userid });

    console.log(user);
    console.log(product);

    if (product.stock < 1) {
        res.send("stock unavailable");
        res.json({ status: false });
    } else {
        res.send("stock available");
        if (!user) {
            console.log("cart empty");
            const addToCart = await cartdb({
                owner: userid,
                items: [{ product: ID, totalPrice: product.price }],
                cartTotal: product.price,
            });
            await addToCart.save()
                console.log("added successfully");
                // res.redirect("/productdetail/" + ID);
            
        } else {
            const productExist = await cartdb.findOne({
                owner: userid,
                "items.product": ID,
            });

            // console.log('you have the cart')
            if (productExist !== null) {
                console.log(productExist);
                console.log("product exist");

                await cartdb
                    .findOneAndUpdate(
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
                    ) 
                    // .then(() => {
                    //     res.redirect("/productdetails/" + ID);
                    // });
            } else {
                console.log('hiiiiiiiiiiiiiiiiii')

                console.log(req.session.user_detail._id);
                console.log(userid);
                const newproductAdd = await cartdb.findOneAndUpdate(
                    {owner:userid},
                    {
                        $push: {items: { product: ID,totalPrice: product.price,}},
                        $inc: { cartTotal: product.price },
                    }
                );
                console.log(newproductAdd);
                console.log('hope');
                newproductAdd.save().then(() => {
                    console.log("newproduct added successfully");
                    // res.redirect("/productdetails/" + ID);
                });
            }
        }
    }
};

const quantityChange = async (req, res) => {

    console.log(".....................................................................................")
    console.log(req.body);
    // const { cartid, productid, count } = req.query;
    console.log(req.body.cartID);
    console.log(req.body.productID);
    // const {cartid,productid,count} = req.body


    const product = await productdb.findOne({_id:req.body.productID});
    console.log(product,"...............///////////////////////////////////////////////////////////")
    // cartTotal = product.price;

    console.log("change the quuantity");
    // if (count == 1) {
    //     let product_price = product.price;
    // } else {
    //     let product_price = -product.price;
    // }

if(req.body.count == 1)var product_price = product.price;

else
    var product_price = -product.price;

    
    await cartdb
        .findOneAndUpdate(
            {
                _id: req.body.cartID,
                "items.product": req.body.productID,
            },
            {
                $inc: {
                    "items.$.quantity":req.body.count ,
                    "items.$.totalprice": product_price,
                    cartTotal: product_price,
                },
            }
        )
        .then((res) => {
            res.json();
        });
};
module.exports = {
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
};
