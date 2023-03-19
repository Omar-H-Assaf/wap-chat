const express = require('express');
var path = require("path")
const app = express();
var loginRoutes = require('./routes/login.js');

app.listen(80, () => {
    console.log('Your Server is running on 80');
});



//Read the parameters from post request
app.use(express.static(path.join(__dirname,"styles")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/login',loginRoutes);
