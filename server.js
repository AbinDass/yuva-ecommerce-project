const mongoosdb = require("./config/mongooseConnection");
const app = require("./app.js");

mongoosdb
    .then(() => {
        console.log("DB connected");
    })
    .catch((error) => {
        console.log(`error in db ${error}`);
    });

const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, (error) => {
    if (error) {
        console.log("error raised , sesrber cant start", error);
    } else {
        console.log(`server is successfully Running,App start at ${PORT}`);
    }
});
