const cartdb = require('../Model/userschema/Cart')

loginCheck = (req,res,next)=>{
if(req.session.user_detail || req.session.otpverifyed){
    
    next()
}else{
    res.redirect('/login')
}
}

module.exports = loginCheck