// import modules here
const db = require("../config/mongooseConnection");
const usersignupdb = require("../Model/userschema/usersuignupmodel");
const productdb = require("../Model/adminscema/product");
const cartdb = require("../Model/userschema/Cart");
const addressdb = require("../Model/userschema/address");
// const users = require('../Model/userschema/usersuignupmodel')
const bcrypt = require("bcrypt");
const { sendotp, verifyotp } = require("../utilities/otp");
const { default: mongoose } = require("mongoose");
const { findOneAndUpdate, count } = require("../Model/userschema/usersuignupmodel");
const address = require("../Model/userschema/address");

const userhomeview = (req, res) => {
    user_profile = req.session.user_detail;

    // let user = req.session.user
    res.render("user/userhome", { user_profile });
};

const userLoginview = (req, res) => {
    if (req.session.user_detail) {
        res.redirect("/");
    } else {
        res.render("user/login");
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
                // if(user.access == true){
                // req.session.userdetail
                req.session.user_detail = user;
                //     res.redirect('/')
                // }
                // else{
                //     res.send('acces denied')
                // }

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

const postsignupview = async (req, res) => {
    console.log("signuppost is working");
    console.log(req.body);
    const email = req.body.email;
    const hashedpassword = await bcrypt.hash(req.body.password, 10);
    const hashedconfirmpassword = await bcrypt.hash(req.body.confirmpassword, 10);
    const mobilenum = req.body.mobilenumber;

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
        console.log("this is the cart", cartitems);
        res.render("user/cart", { cartitems, owner: req.session.user_detail });
    } catch (err) {
        console.log(err);
    }
};

const addcart = async (req, res) => {
    const ID = req.params.id;
    const userid = req.session.user_detail._id;

    const product = await productdb.findOne({ _id: ID });
    const user = await cartdb.findOne({ owner: userid });

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
            await addToCart.save();
            console.log("added successfully");
        } else {
            const productExist = await cartdb.findOne({
                owner: userid,
                "items.product": ID,
            });

            if (productExist !== null) {
                console.log("product exist");
                console.log(req.body);
                console.log(product.quantity);
                console.log(product);

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

const quantityChange = async (req, res) => {
    console.log(req.body);
    console.log(req.body.cartID);
    console.log(req.body.productID);

    const products = await productdb.findOne({ _id: req.body.productID });
    cartTotal = products.price;

    console.log("change the quuantity");

    if (req.body.Count == 1) var product_price = products.price;
    else var product_price = -products.price;

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
    res.status(200).json({ message: "qty" });
};

const profile = async (req, res) => {
    user = req.session.user_detail;
    const userid = req.session.user_detail._id;
    // const finduser = await usersignupdb.findOne({_id:userid})
    const useraddress = await addressdb.findOne({ user: userid }).populate("user");
    // const findaddress
    if (useraddress) {
        findaddress = useraddress.address;
    } else {
        res.send("something wrong");
    }
    res.render("user/profile", { useraddress, findaddress, user });
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

const checkout = async (req, res) => {
    const userid = req.session.user_detail._id
    const useraddress = await addressdb.findOne({ user: userid })
    const cartdetails = await cartdb.findOne({ owner: mongoose.Types.ObjectId(userid) }).populate("items.product");
let address
if(useraddress){
    address = useraddress.address
}else{
    res.send('sorry')
}

    console.log(cartdetails);
    res.render("user/checkout",{address,cartdetails});
};

const addresscheckout = async (req, res) => {
    console.log(req.body);
    const userid = req.session.user_detail._id;
    await addressdb.findOneAndUpdate({ userid }, { $push: { address: [req.body] } });
    res.redirect("/checkout");
    
};

const logout = (req, res) => {
    res.session.distroy();
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
    profile,
    addprofile,
    deleteaddress,
    checkout,
    addresscheckout,

    logout,
};
