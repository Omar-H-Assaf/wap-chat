const express = require('express');
const router = express.Router();
var path = require("path");

const {chatRoomList:chatRoomList} = require("./openchatRoom");


router.post("/",function(req,res,next){  
    let userChatRooms = req.body.chatRoomList
    console.log("userChatRooms",userChatRooms)
     const cookieNewMessagesList =  req.cookies.newMessagesList;
     const currentUser = req.cookies.currentUser;

    for (const userChatRoom of userChatRooms) {
        const chatRoomIndex = chatRoomList.findIndex(room => room.chatRoomName === userChatRoom);
        if (chatRoomIndex !== -1) {
          if (chatRoomList[chatRoomIndex].newMessages.length !== 0) {

            const newMessage = chatRoomList[chatRoomIndex].newMessages[chatRoomList[chatRoomIndex].newMessages.length-1];
          
            // console.log("currentUser  = ", currentUser)
            // console.log("cookieNewMessagesList before  = ", cookieNewMessagesList)
    
            // console.log("currentUser.userName == message.receiver  =",currentUser.userName == newMessage.receiver )
            // console.log("message.receiver  =",newMessage.receiver )
            // console.log("message  =",newMessage )


            if(currentUser.userName == newMessage.receiver){
             
              const chatRoomIndexNewMessagesList = cookieNewMessagesList.findIndex(room => room.chatRoomName === userChatRoom);
                      //   console.log("cookieNewMessagesList  = ", cookieNewMessagesList)

              if(chatRoomIndexNewMessagesList !== 1){
                cookieNewMessagesList[chatRoomIndexNewMessagesList].newMessages.push(newMessage)
               // console.log("index found and value pushed  = ", chatRoomIndexNewMessagesList , "arr ",cookieNewMessagesList[chatRoomIndexNewMessagesList])
                chatRoomList[chatRoomIndex].newMessages.pop()
              }
    
            }
    
           

              
          }
      
        }
      }
    //  console.log("cookieNewMessagesList after loop ",cookieNewMessagesList)
      res.cookie("newMessagesList",cookieNewMessagesList);

      res.send("");
});

module.exports = router;





