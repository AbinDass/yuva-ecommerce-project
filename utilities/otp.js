const sid = process.env.SID;
const token = process.env.AUTH_TOKEN;
const serviceid = process.env.SSID;
const client = require("twilio")(sid, token);

client.verify.v2.services.create({ friendlyName: "Persuit" }).then(() => console.log("OTP Ready"));

function sendotp(mobile) {
    client.verify.v2
        .services(serviceid)
        .verifications.create({ to: `+91${mobile}`, channel: "sms" })
        .then((verification) => console.log(verification.status));
    console.log("fffffffffffffffffffffffffffff");
}

function verifyotp(mobile, otp) {
    return new Promise((resolve, reject) => {
        client.verify.v2
            .services(serviceid)
            .verificationChecks.create({ to: `+91 ${mobile}`, code: otp })
            .then((verification_check) => {
                console.log(verification_check.status);
                resolve(verification_check);
            });
    });
}

module.exports = {
    sendotp,
    verifyotp,
};
