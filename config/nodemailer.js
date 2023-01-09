const randomstring = require('randomstring')

const nodemailer = require('nodemailer')

const mailer = nodemailer.createTransport({
  host: process.env.Server,
  port: process.env.port,
  auth: {
    user: process.env.Login,
    pass: process.env.pass
  }
})

module.exports = mailer