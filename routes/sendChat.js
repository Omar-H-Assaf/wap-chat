const express = require('express');
const router = express.Router();
var path = require("path");

const {admin,auth}  = require("../AdminSdkfirebase");

const database = admin.database();

router.post("/",function(req,res,next){
    console.log(req.body.userName)
    console.log(req.body.msg)
   
    const sortedUsernames = [req.body.userName, req.cookies.currentUser.userName].sort();
    const chatRoomNumber = sortedUsernames.join('-');
    const chatRoom = `/chatRooms/${chatRoomNumber}`;
     console.log("chatRoom from sendChat  = ",chatRoom)
// Get a reference to the chatroom's messages collection
const chatroomRef = admin.database().ref(chatRoom);
const messagesRef = chatroomRef.child("messages");

// Create a new message object
const message = {
  sender:req.cookies.currentUser.userName,
  receiver:req.body.userName,
  text: req.body.msg,
  timestamp: admin.database.ServerValue.TIMESTAMP
};

// Save the message object to the chatroom's messages collection
const newMessageRef = messagesRef.push();
newMessageRef.set(message);
console.log("is receiver =   ",message.receiver == req.body.userName)
console.log("message.receiver =   ",message.receiver )
console.log("req.body.userName =  ",req.body.userName)

if(message.receiver == req.body.userName){

  console.log(`/newMessage/${req.body.userName}`)
  admin.database().ref(`/newMessage/${req.body.userName}`).push({
    message: message,
    chatRoomName: chatRoomNumber,
    isRead: false
  });
}
res.send(true)
});

module.exports = router;





