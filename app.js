const express = require('express');
var path = require("path")
const app = express();
var loginRoutes = require('./routes/login.js');
var homeRoutes = require('./routes/home.js');
var signupRoutes = require('./routes/signup.js');
var cookieParser = require("cookie-parser");
var ejs = require("ejs");

app.listen(80, () => {
    console.log('Your Server is running on 80');
});

//Read the parameters from post request
app.use(cookieParser());
app.use(express.static(path.join(__dirname,"styles")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

app.use('/login',loginRoutes);
app.use('/signup',signupRoutes);
app.use('/',homeRoutes);
