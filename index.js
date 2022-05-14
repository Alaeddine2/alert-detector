const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const configs = require('./config/config');
const adminRoute = require("./routes/admin_routes");
const loginRoute = require("./routes/login_route");
const clientRoute = require('./routes/client_routes');
const alertRoute = require('./routes/alert_routes');
const socRoute = require('./routes/soc_routes');
const deviceRoute = require('./routes/device_routes');

require('dotenv').config()

mongoose
    .connect(
        process.env.MONGODB_URI || configs.MONGO_URI + "/" + "pfe",
        {useNewUrlParser: true}
    )
    .then(() => {
        console.log("MongoDB database connection established successfully");
    })
    .catch(err => {
        console.log(err.message);
    });

app.use(cors());
app.use(bodyParser.json());

app.use("/admin", adminRoute);
app.use("/auth", loginRoute);
app.use("/client", clientRoute);
app.use("/alert", alertRoute);
app.use("/soc", socRoute);
app.use("/device", deviceRoute);

app.get('/', (req, res) =>{
    res.send('test')
})

const server = app.listen(process.env.PORT || configs.BACKEND_PORT, function () {
    console.log("Student management system backend server is running on port : " + (process.env.PORT || configs.BACKEND_PORT));
});