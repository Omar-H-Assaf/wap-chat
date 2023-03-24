const express = require('express');
const router = express.Router();
var path = require("path");
const {admin,auth}  = require("../AdminSdkfirebase");

function parseJwt (token) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

const userContacts = [{name: "Louis Litt", uid: ""},
{name: "Assaf Assaf", uid: ""}];

let contact = [];

router.get("/",function(req,res,next){

    if (!req.cookies.jwt) {
        
        res.redirect("/login");
    }
    const jwt = parseJwt(req.cookies.jwt);

    res.render("home", {name : jwt.name, userContacts: userContacts, contacts: contact});
});

router.post("/", function(req,res,next){
    userContacts.push(req.body);
    contact = contact.filter(e=> {
        return e.name !== req.body.name;
    });
    res.send("success");
});

module.exports = router;
