const express = require('express');
const router = express.Router();
var path = require("path");

router.get("/",function(req,res,next){
    res.sendFile(path.join(__dirname,"../","views","signup.html"));
});

module.exports = router;
