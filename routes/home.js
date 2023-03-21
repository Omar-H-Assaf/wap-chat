const express = require('express');
const router = express.Router();
var path = require("path");

function parseJwt (token) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

const userContacts = [{name: "Louis Litt", lastMsg: "You just got LITT up, Mike."},
{name: "Assaf Assaf", lastMsg: "Hello how are you?"}];

let contact = [{name: "Omar Assaf", lastMsg: ""},{name: "Assaf Omar", lastMsg: ""}];

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
