const express = require('express');
const router = express.Router();
var path = require("path");

const {admin,auth}  = require("../AdminSdkfirebase");

const database = admin.database();
let chatRoomList =[]

router.post("/",function(req,res,next){
    console.log(req.body.userName)
    console.log(req.cookies)
    let messageList =[];

    const sortedUsernames = [req.body.userName, req.cookies.currentUser.userName].sort();
    const chatRoomName = sortedUsernames.join('');
    const chatRoom = `/chatRooms/${chatRoomName}`;

    if (!req.cookies.chatRoomList) {
      res.cookie("chatRoomList", []);
      req.cookies.chatRoomList =[];
      res.cookie("newMessagesList", []);
      req.cookies.newMessagesList =[];
    } 
    if (!req.cookies.chatRoomList.includes(chatRoomName)) {
        req.cookies.chatRoomList.push(chatRoomName);
        res.cookie("chatRoomList", req.cookies.chatRoomList);

        req.cookies.newMessagesList.push({ chatRoomName: chatRoomName, newMessages: [] });
        res.cookie("newMessagesList", req.cookies.newMessagesList);

       
      }
    
    
   

    const chatroomRef = database.ref(chatRoom);
    const messagesRef = chatroomRef.child("messages");


 let chatRoomIndex = chatRoomList.findIndex(room => room.chatRoomName === chatRoomName);

      if (chatRoomIndex === -1) {
        chatRoomList.push({ chatRoomName: chatRoomName, newMessages: [] });
        chatRoomIndex = chatRoomList.length - 1;
          
        // Set up a listener for new messages added to the chatroom
        messagesRef.on("child_added", (snapshot) => {
        const message = snapshot.val();
        console.log("New message:",chatRoomName, message);
        chatRoomList[chatRoomIndex].newMessages.push(message);
    
      });
      }
   
      messagesRef.once("value").then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
          const message = childSnapshot.val();
          messageList.push(message);
          chatRoomList[chatRoomIndex].newMessages = [];
        });
      
             console.log("  chatRoomList[chatRoomIndex].newMessages",  chatRoomList[chatRoomIndex].newMessages)
      res.send({ messageList: messageList, userName: req.body.userName });
}).catch((error) => {
  console.error("Error loading messages:", error);
});

});

module.exports = {router, chatRoomList};





