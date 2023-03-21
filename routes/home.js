const express = require('express');
const router = express.Router();
var path = require("path");

function parseJwt (token) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

router.get("/",function(req,res,next){

    if (!req.cookies.jwt) {
        
        res.redirect("/login");
    }

    const jwt = parseJwt(req.cookies.jwt);
    res.render("home", {name : jwt.name})
});

module.exports = router;
