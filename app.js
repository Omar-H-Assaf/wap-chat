const express = require('express');
const path = require("path")
const ejs = require('ejs');
const cookieParser = require("cookie-parser");
const app = express();

const loginRoutes = require('./routes/login.js');
const homeRoutes = require('./routes/home.js');
const signupRoutes = require('./routes/signup.js');
const userRoutes = require('./routes/users.js');
const {router: chatRoomRoutes} = require('./routes/openchatRoom.js');

const sendChatRoutes = require('./routes/sendChat.js');
const getChatRoutes = require('./routes/getChats.js');


//EJS Engine
app.set('view engine', 'html');

app.engine('html', ejs.renderFile);

//Read the parameters from post request
app.use(cookieParser());
app.use(express.static(path.join(__dirname,"styles")));
app.use(express.static(path.join(__dirname,"js")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.listen(80, () => {
    console.log('Your Server is running on 80');
});



app.use('/login',loginRoutes);
app.use('/signup',signupRoutes);
app.use('/findUser',userRoutes);
app.use('/openChatRoom',chatRoomRoutes);
app.use('/sendChat',sendChatRoutes);
app.use('/getChat',getChatRoutes);
app.use('/',homeRoutes);


