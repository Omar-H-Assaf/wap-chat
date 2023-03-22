const express = require('express');
const router = express.Router();
var path = require("path");

const {chatRoomList:chatRoomList} = require("./openchatRoom");


router.post("/",function(req,res,next){  
    let userChatRooms = req.body.chatRoomList
    console.log("userChatRooms",userChatRooms)
     let newMessageLists = [];
    for (const userChatRoom of userChatRooms) {
        const chatRoomIndex = chatRoomList.findIndex(room => room.chatRoomName === userChatRoom);
        
        if (chatRoomIndex !== -1) {
          if (chatRoomList[chatRoomIndex].newMessages.length !== 0) {
            const messageList = chatRoomList[chatRoomIndex].newMessages;
            newMessageLists.push({
                chatRoomName: userChatRoom,
                newMessages: messageList
              });

              chatRoomList[chatRoomIndex].newMessages =[]
          }
      
        }
      }


      res.send({ newMessageList: newMessageLists});
});

module.exports = router;





