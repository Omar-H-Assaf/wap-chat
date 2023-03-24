const express = require('express');
const router = express.Router();
var path = require("path");
const {admin,auth}  = require("../AdminSdkfirebase");

const {chatRoomList:chatRoomList} = require("./openchatRoom");
const AsyncLock = require("async-lock");
const { async } = require('@firebase/util');
const lock = new AsyncLock();

router.post("/",  async function(req,res,next){  

  lock.acquire("myLock", async function(done) {
    // This code will only be executed by one request at a time
    
    // let userChatRooms = req.body.chatRoomList
    // console.log("userChatRooms",userChatRooms)
    //  const cookieNewMessagesList =  req.cookies.newMessagesList;
    //  const currentUser = req.cookies.currentUser;

    // for (const userChatRoom of userChatRooms) {
    //     const chatRoomIndex = chatRoomList.findIndex(room => room.chatRoomName === userChatRoom);
    //     if (chatRoomIndex !== -1) {
    //       if (chatRoomList[chatRoomIndex].newMessages.length !== 0) {

    //         const newMessage = chatRoomList[chatRoomIndex].newMessages[chatRoomList[chatRoomIndex].newMessages.length-1];
    //        if(newMessage){
    //         if(currentUser.userName == newMessage.receiver){
             
    //           const chatRoomIndexNewMessagesList = cookieNewMessagesList.findIndex(room => room.chatRoomName === userChatRoom);
    //                   //   console.log("cookieNewMessagesList  = ", cookieNewMessagesList)

    //           if(chatRoomIndexNewMessagesList !== 1){
    //             cookieNewMessagesList[chatRoomIndexNewMessagesList].newMessages.push(newMessage)
    //            // console.log("index found and value pushed  = ", chatRoomIndexNewMessagesList , "arr ",cookieNewMessagesList[chatRoomIndexNewMessagesList])
    //             chatRoomList[chatRoomIndex].newMessages.pop()
    //           }
    
    //         }
    //        }
    //         // console.log("currentUser  = ", currentUser)
    //         // console.log("cookieNewMessagesList before  = ", cookieNewMessagesList)
    
    //         // console.log("currentUser.userName == message.receiver  =",currentUser.userName == newMessage.receiver )
    //         // console.log("message.receiver  =",newMessage.receiver )
    //         // console.log("message  =",newMessage )


    
    
           

              
    //       }
      
    //     }
    //   }
    // //  console.log("cookieNewMessagesList after loop ",cookieNewMessagesList)
    //   res.cookie("newMessagesList",cookieNewMessagesList);

     let  newmessages =  await getChats(req);
      done(); // Release the lock
      console.log("/newmessages ",newmessages)
      res.send(newmessages);

    
  });

  
});


async function getChats(req) {
  const messages = [];
  const receiverName = req.cookies.currentUser.userName;
  console.log(`/newMessage/receiverName = `, `/newMessage/${receiverName}`);

  await admin
    .database()
    .ref(`/newMessage/${receiverName}`)
    .once("value")
    .then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const messageData = childSnapshot.val();
        const message = messageData.message;
        const chatRoomName = messageData.chatRoomName;
        const isRead = messageData.isRead || false; // Add isRead flag with default value of false
        messages.push({
          message: message,
          chatRoomName: chatRoomName,
          isRead: isRead, // Add isRead flag to the message object
        });
       // childSnapshot.ref.update({ isRead: true });
       childSnapshot.ref.remove();

      }) 
    });
      console.log("New messages: from getChats", messages);

      // Delete only the copied messages
    //   const copiedMessages = []; // Replace with the array of copied messages
    //   snapshot.forEach((childSnapshot) => {
    //     const messageData = childSnapshot.val();
    //     const message = messageData.message;
    //     const chatRoomName = messageData.chatRoomName;
    //     const isRead = messageData.isRead || false; // Add isRead flag with default value of false
    //     const copiedMessage = messages.find(
    //       (m) =>
    //         m.message === message &&
    //         m.chatRoomName === chatRoomName &&
    //         m.isRead === isRead // Check isRead flag also
    //     );
    //     if (copiedMessage) {
    //       childSnapshot.ref.remove();
    //     }
    //   });
    // })
    // .catch((error) => {
    //   console.error("Error removing new messages:", error);
    // });

  // // Mark read messages as read
  // await Promise.all(
  //   messages
  //     .filter((m) => m.isRead)
  //     .map(({ chatRoomName, message }) =>
  //       admin
  //         .database()
  //         .ref(`/newMessage/${receiverName}`)
  //         .orderByChild("message")
  //         .equalTo(message)
  //         .once("value")
  //         .then((snapshot) =>
  //           snapshot.forEach((childSnapshot) =>
  //             childSnapshot.ref.update({ isRead: true })
  //           )
  //         )
  //     )
  // );

  // Filter out read messages
  const unreadMessages = messages.filter((m) => !m.isRead);

  return unreadMessages;
}


//  async function getChats(req){
//   const messages = [];
//   const receiverName = req.cookies.currentUser.userName; 
//   console.log(`/newMessage/receiverName = `,`/newMessage/${receiverName}`)

//   await admin.database().ref(`/newMessage/${receiverName}`).once("value")
//   .then((snapshot) => {

//     snapshot.forEach((childSnapshot) => {
//       const messageData = childSnapshot.val();
//       const message = messageData.message;
//       const chatRoomName = messageData.chatRoomName;
//       messages.push({
//         message: message,
//         chatRoomName: chatRoomName
//       });
//     });
//     console.log("New messages: from getChats", messages);
    
    
//     // Delete only the copied messages
//    const copiedMessages = []; // Replace with the array of copied messages
//     snapshot.forEach((childSnapshot) => {
//       const messageData = childSnapshot.val();
//       const message = messageData.message;
//       const chatRoomName = messageData.chatRoomName;
//       const copiedMessage = messages.find((m) => m.message === message && m.chatRoomName === chatRoomName);
//       if (copiedMessage) {
//         childSnapshot.ref.remove();
//       }
//     });
//   })
//   .catch((error) => {
//     console.error("Error removing  new messages:", error);
//   });


//   return messages;
// }

module.exports = router;





