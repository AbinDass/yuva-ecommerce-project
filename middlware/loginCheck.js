

const loginCheck = (req,res,next)=>{
if(req.session.user_detail){
    next()
}else{
    res.redirect('/login')
}
}

module.exports = loginCheck