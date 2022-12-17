const db = require("../config/mongooseConnection");
const userdb = require("../Model/userschema/usersuignupmodel");
const categorydb = require("../Model/adminscema/category");
const productdb = require("../Model/adminscema/product");
const { create } = require("../Model/adminscema/category");

const getAdminlogin = (req, res) => {
    res.render("admin/adminlogin");
};

const getAdminhome = (req, res) => {
    res.render("admin/adminhome");
};

const postAdminlogin = (req, res) => {
    // console.log("helooooooooooooooooo");
    // console.log(req.body);
    const Adminemail = process.env.ADMIN_EMAIL;
    const Adminpassword = process.env.ADMIN_PASSWORD;

    const { email, password } = req.body;
    // console.log(req.body);

    if (Adminemail == email && Adminpassword == password) {
        res.render("admin/adminhome");
    } else {
        res.render("admin/adminlogin");
    }
};

const finduserview = async (req, res) => {
    // let userdetails =await db.get().collection('userDetails').find().toArray()
    const userdetails = await userdb.find();
    // console.log(userdetails);
    res.render("admin/adminfinduser", { userdetails });
};

const blockuser = async (req, res) => {
    const userid = req.params.id;
    // console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");

    let data = await userdb.findByIdAndUpdate(userid, { access: false });

    if (data) {
        // console.log("unlbock121233 section");
        res.redirect("/admin/finduser");
    } else {
        res.redirect("/admin/adminhome");
    }
};

const unblockuser = async (req, res) => {
    const userid = req.params.id;

    // console.log("unlbock section");
    let data = await userdb.findByIdAndUpdate(userid, { access: true });
    if (data) {
        // console.log("unlbock sectioedfghjkln");

        res.redirect("/admin/finduser");
    } else {
        res.redirect("/admin/adminhome");
    }
};

const addcategory = (req, res) => {
    res.render("admin/addcategory");
};

const postcategory = async (req, res) => {
    // const categoryname = req.body.categoryname;
    // const description = req.body.description;
    // console.log(req.body);
    const categoryinfo = req.body;
    const img = req.files;
    // console.log(img);
    Object.assign(categoryinfo, { image: img });
    // console.log(categoryinfo);
    await categorydb.create(categoryinfo);
    res.redirect("/admin/listcategory");
};

const categoryList = async (req, res) => {
    const categorylist = await categorydb.find();
    res.render("admin/categorylist", { categorylist });
};

const edit_category = async (req, res) => {
    const categoryid = req.params.id;
    const categorydata = await categorydb.find({ _id: categoryid });
    console.log("details", categorydata);
    res.render("admin/editcategory", { categorydata });
};

const edited_categoery = async (req, res) => {
    data = req.body;
    img = req.files;
    try {
        const ID = req.params.id;
        if (img < 1) {
            console.log("empty");
            res.redirect("/admin/editcategory/" + ID);
        } else {
            console.log("update category coming");
            // console.log('id s  is soos  ssj',ID);
            // console.log(data);
            img = req.files;
            // console.log(img);
            Object.assign(data, { image: img });
            await categorydb.findByIdAndUpdate(ID, { $set: data });
            res.redirect("/admin/listcategory");
        }
    } catch (err) {
        res.send("makesure all are filled");
        res.redirect("/admin/adminhome");
    }
};

const deletecategory = async (req, res) => {
    const ID = req.params.id;
    await categorydb.findOne({ _id: ID }).remove();
    res.redirect("/admin/listcategory");
};

const addproducts = async (req, res) => {
    category = await categorydb.find();
    res.render("admin/addproduct", { category });
};

const addedProducts = async (req, res) => {
    const productinfo = req.body;
    const imgs = req.files;
    console.log(imgs);
    Object.assign(productinfo, { image: imgs });
    await productdb.create(productinfo);
    console.log(productinfo);
    res.redirect("/admin/productlist");
};

const productlist = async (req, res) => {
    const productdetails = await productdb.find();
    res.render("admin/productlist", { productdetails });
};
const editproduct = async (req, res) => {
    const ID = req.params.id;
    const product = await productdb.find({ _id: ID });
    console.log(product);
    const category = await categorydb.find();
    res.render("admin/editproduct", { category, product });
};
const updateproduct = async (req, res) => {
    try {
        const data = req.body;
        const imgs = req.files;
        console.log(imgs);
        ID = req.params.id;
        console.log(ID);

        if (imgs == 0) {
            Object.assign(data);
            await productdb.findByIdAndUpdate(ID, { $set: data })
            console.log("empty image");
            res.redirect("/admin/productlist/");
        } else {
            console.log("updated product is  coming");
            Object.assign(data, { image: imgs });
            await productdb.findByIdAndUpdate(ID, { $set: data });
            res.redirect("/admin/productlist");
        }
    } catch (err) {
        // res.send("makesure all are filled");
        console.log(err.message);
        res.redirect("/admin/" + ID);
    }
};

const deleteproduct = async (req, res) => {
    const ID = req.params.id;
    await productdb.findOne({ _id: ID }).remove();
    res.redirect("/admin/productlist");
};

module.exports = {
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
};
