const db = require("../config/mongooseConnection");
const userdb = require("../Model/userschema/usersuignupmodel");
const categorydb = require("../Model/adminscema/category");
const productdb = require("../Model/adminscema/product");
const orderdb = require("../Model/userschema/order");
const addressdb = require("../Model/userschema/address");
const { create } = require("../Model/adminscema/category");
const address = require("../Model/userschema/address");
const coupondb = require("../Model/adminscema/coupon");
const bannerdb = require('../Model/adminscema/banner');
const { json } = require("express");

const getAdminlogin = (req, res) => {
    res.render("admin/adminlogin");
};

const Dashboard = (req, res) => {
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
        req.session.adminlogedin = true;
        res.redirect("/admin/adminhome");
    } else {
        res.redirect("/admin");
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
            await productdb.findByIdAndUpdate(ID, { $set: data });
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

const addcoupen = (req, res) => {
    res.render("admin/addcoupon");
};
const coupenadd = (req, res) => {
    console.log("hiiiiiiiii", req.body);
    const coupon = new coupondb(req.body);
    coupon.save().then((respose) => {
        res.redirect("/admin/addcoupen");
    });
};
const showCoupons = async (req,res)=>{
    const coupons = await coupondb.find()
    res.render('admin/showcoupons',{coupons})
}
const deleteCoupon = async (req,res)=>{
    const couponid = req.params.id
    console.log(couponid);
    await coupondb.findOneAndDelete({_id:couponid})
    res.redirect('/admin/showcoupons')
}

const seeOrders = async (req, res) => {
    const order = await orderdb.find();
    // console.log(order);
    res.render("admin/orders", { order });
};
const orderView = async (req, res) => {
    const orderid = req.params.id;

    const orderdetail = await orderdb.findOne({ _id: orderid }).populate("orderitems.product");
    const addressid = orderdetail.address;
    const orderaddress = await addressdb.findOne({ addressid });
    const userdata = await orderdb.findOne({ _id: orderid }).populate("owner");

    res.render("admin/orderdetail", { orderdetail, orderaddress, userdata });
};
const orderStatusChange = async (req,res)=>{
    try {      
        console.log(req.body);
        const orderid = req.body.orderid
        const status = req.body.status
        if(status == "Delivered"){
            console.log(status,'if caseeeeeeeeeeeeee');
          await orderdb.updateOne(
                {_id:orderid},
                {$set:{orderstatus:status , paymentstatus:'payment completed'}}
                ).then((result)=>{
                    res.json('success')
                })
        }else{
            console.log('else case issss'+status);
           await orderdb.updateOne(
                {_id:orderid},
                {$set:{orderstatus:status}}
                ).then((result)=>{
                    res.json('success')
                })
        }
    } catch (error) {
        console.log(error)
    }
}

const Banner = (req,res)=>{
    res.render('admin/banner')
} 
const addbanner = async (req,res)=>{
console.log(req.body);
const banneris = req.body
const img = req.files
Object.assign(banneris,{image:img})

const banner = await bannerdb.create(banneris)
console.log(banner);
res.redirect('/admin/addbanner')
}

const showBanner = async (req,res)=>{
   const banner = await bannerdb.find()
   console.log(banner);
    res.render('admin/showbanner',{banner})
}
const DeleteBanner = async (req,res)=>{
    const bannerid = req.params.id
    console.log(bannerid);
    await bannerdb.findOneAndDelete({_id:bannerid})
    res.redirect ('/admin/showbanners')
}
const salesreport = async (req,res)=>{
    console.log('asddf');
    try {
        const salesreport = await orderdb.aggregate([
            {
                $match:{orderstatus:{$eq:'Delivered'}}
            },
            {
                $group:{_id:{
                    year:{$year:"$createdAt"},
                    month:{$month:"$createdAt"},
                    day:{$dayOfMonth:"$createdAt"}
                },
                ordertotal:{$sum:"$ordertotal"},
                items:{$sum:{$size:"$orderitems"}},
                count:{$sum:1}
            }
            },{$sort:{date:-1}}
        ])

        console.log(salesreport);
        res.render('admin/salesreport',{salesreport})
    } catch (error) {
        throw error
    }
}

const monthlyreport = async (req,res)=>{
    try {

         const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
console.log('monthlyyyyyyyyyyyyyy');
        const salesreport = await orderdb.aggregate([
            {
                $match:{orderstatus:{$eq:'Delivered'}}
            },
            {
                $group:{_id:{
                    month:{$month:"$createdAt"},
                },
                ordertotal:{$sum:"$ordertotal"},
                items:{$sum:{$size:"$orderitems"}},
                count:{$sum:1}
            }
            },{$sort:{date:-1}}
        ])

        const newSalesReport = salesreport.map((el) => {
            let newEl = { ...el };
            newEl._id.month = months[newEl._id.month - 1];
            return newEl;
          });
          console.log(salesreport);       
          res.render('admin/monthlyreport',{salesreport:newSalesReport})
    } catch (error) {
        throw error
    }
}

const yearlyreport = async (req,res)=>{    
        try {
            const salesreport = await orderdb.aggregate([
                {
                    $match:{orderstatus:{$eq:'Delivered'}}
                },
                {
                    $group:{_id:{
                        year:{$year:"$createdAt"},
                    },
                    ordertotal:{$sum:"$ordertotal"},
                    items:{$sum:{$size:"$orderitems"}},
                    count:{$sum:1}
                }
                },{$sort:{createdAt:-1}}
            ])
    
            console.log(salesreport)
        res.render('admin/yaerlyreport',{salesreport})
    } catch (error) {
        throw error
    }
}

    const  changeChart = async (req,res)=>{
        try {

            if(req.query.day){
                const dayreport = await orderdb.aggregate([
                    {
                        $match:{orderstatus:{$eq:'Delivered'}}
                    },
                    {
                        $group:{_id:{                                                     
                            year:{$year:"$createdAt"},
                            month:{$month:"$createdAt"},
                            day:{$dayOfMonth:"$createdAt"}
                        },
                        ordertotal:{$sum:"$ordertotal"},
                        items:{$sum:{$size:"$orderitems"}},
                        count:{$sum:1}
                    }
                    },{$sort:{date:-1}}
                ])
        
                console.log(dayreport);
                res.json({dayreport})
            }else if(req.query.year){
                const yearreport = await orderdb.aggregate([
                    {
                        $match:{orderstatus:{$eq:'Delivered'}}
                    },
                    {
                        $group:{_id:{                                                     
                            year:{$year:"$createdAt"},
                        },
                        ordertotal:{$sum:"$ordertotal"},
                        items:{$sum:{$size:"$orderitems"}},
                        count:{$sum:1}
                    }
                    },{$sort:{date:-1}}
                ])
        
                console.log(yearreport);
                res.json({yearreport})
            }else if(req.query.revanue){
                
                    const revanuereport = await orderdb.aggregate([
                        {
                            $match:{orderstatus:{$eq:'Delivered'}}
                        },
                        {
                            $group:{_id:{
                                year:{$year:"$createdAt"},
                                month:{$month:"$createdAt"},
                                day:{$dayOfMonth:"$createdAt"}
                            },
                            ordertotal:{$sum:"$ordertotal"},
                            items:{$sum:{$size:"$orderitems"}},
                            count:{$sum:1}
                        }
                        },{$sort:{date:-1}}
                    ])
            
                    console.log(revanuereport);
                    res.json({revanuereport})
                
            }else{

                const salesreport = await orderdb.aggregate([
                    {
                        $match:{orderstatus:{$eq:'Delivered'}}
                    },
                    {
                        $group:{_id:{
                            
                            month:{$month:"$createdAt"}
    
    
    
                            
                        },
                        ordertotal:{$sum:"$ordertotal"},
                        items:{$sum:{$size:"$orderitems"}},
                        count:{$sum:1}
                    }
                    },{$sort:{date:-1}}
                ])
        
                console.log(salesreport);
               res.json({salesreport})
            }


            
            

        } catch (error) {
            throw error
        }
}

const Logout = (req,res)=>{
    req.session.destroy()
    res.redirect('/admin')
}
module.exports = {
    getAdminlogin,
    postAdminlogin,

    Dashboard,
    finduserview,
    blockuser,
    unblockuser,
    Banner,
    addbanner,
    showBanner,
    DeleteBanner,

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
    orderStatusChange,

    salesreport,
    monthlyreport,
    yearlyreport,

    addcoupen,
    coupenadd,
    showCoupons,
    deleteCoupon,

    changeChart,

    Logout
};
