const express = require('express');
const router = express.Router();
var path = require("path");

const {admin,auth}  = require("../AdminSdkfirebase");


router.post("/",function(req,res,next){

console.log(req.body.userName)

// Retrieve the list of all users from Firebase Auth
admin.auth().listUsers()
  .then((userRecords) => {
    console.log(userRecords)
    // Filter the list to find users with matching display name or username
    const matchingUsers = userRecords.users.filter((user) => {
      return user.displayName === req.body.userName 
    });

    if (matchingUsers.length > 0) {
      console.log('Users with username:', req.body.userName, 'exist');
      console.log('Matching users:', matchingUsers);
      // Handle user exists case
      res.send(true);
    } else {
      console.log('No users with username:', req.body.userName, 'exist');
      // Handle user does not exist case
      res.send(false);
    }
  })
  .catch((error) => {
    console.error('Error listing users:', error);
    // Handle error
    res.status(500).send('Error listing users');
  });

});

module.exports = router;
