const express = require("express")
const app = express()
const path = require('path')
const logger = require('morgan')
const session = require('express-session')
const nocache = require('nocache')
const flash = require('connect-flash')
// const multer = require('multer')

const adminRouter = require('./routes/adminrouter')
const userRouter = require("./routes/userrouter")

app.use(logger('dev'))
app.use(express.urlencoded({extended:true}))

app.use(express.static(path.resolve('./uploaded_images')));

app.use(express.static(path.resolve('./public')));

app.use(express.json());
app.use(nocache())
app.use(flash())

// app.use(multer)

app.set('Views',path.join(__dirname,'Views'))
app.set('view engine','ejs')


app.use(session({
    secret:"sessionkey",
    resave:false,
    saveUninitialized:true,
    cookie:{maxAge:6000000}
}))

app.use('/admin',adminRouter)
app.use('/',userRouter)

// const port = process.env.PORT||3000a@gmail.com
// app.listen(port)

module.exports = app