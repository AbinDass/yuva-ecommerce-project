const adminloginCheck = (req, res, next) => {
    if (req.session.adminlogedin) {
        next();
    } else {
        res.redirect("/admin");
    }
};

module.exports = adminloginCheck;
