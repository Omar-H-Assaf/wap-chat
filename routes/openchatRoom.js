const express = require('express');
const router = express.Router();
const path = require("path");

const { admin, auth } = require("../AdminSdkfirebase");

const database = admin.database();
const chatRoomList = [];

// Create a new chat room in the Firebase Realtime Database
const createChatRoom = async (chatRoomName) => {
  const chatroomRef = admin.database().ref(`/chatRooms/${chatRoomName}`);
  const messagesRef = chatroomRef.child("messages");

  // Check if the chat room already exists in the Firebase Realtime Database
  const snapshot = await chatroomRef.once("value");
  if (!snapshot.exists()) {
    chatroomRef.set({"messages":[
      {
        receiver: "",
        sender: "",
        text: ""
      }
    ]});



  }

  

  // Set up a listener for new messages added to the chatroom
  messagesRef.on("child_added", (snapshot) => {
    const message = snapshot.val();
    console.log("New message:", chatRoomName, message);

    // Find the chat room object in chatRoomList
    const chatRoomIndex = chatRoomList.findIndex(room => room.chatRoomName === chatRoomName);

    if (chatRoomIndex !== -1) {
      // Add new message to chat room object in chatRoomList
      chatRoomList[chatRoomIndex].newMessages.push(message);
    }
  });
}

router.post("/", async function(req, res, next) {
  let response = await openChatRom(req,res)
  console.log("response /openChatRoom = ",response)
  res.send(response);

});

async function openChatRom(req,res){
  console.log(req.body.userName);
  console.log(req.cookies);
  let messageList = [];

  const sortedUsernames = [req.body.userName, req.cookies.currentUser.userName].sort();
  const chatRoomName = sortedUsernames.join('-');
  const chatRoom = `/chatRooms/${chatRoomName}`;

  if (!req.cookies.chatRoomList) {
    res.cookie("chatRoomList", []);
    req.cookies.chatRoomList = [];
  }
  if (!req.cookies.chatRoomList.includes(chatRoomName)) {
    req.cookies.chatRoomList.push(chatRoomName);
    res.cookie("chatRoomList", req.cookies.chatRoomList);
  }

  console.log("chatRoom=  " + chatRoom);

  // Check if chat room already exists in chatRoomList
  let chatRoomIndex = chatRoomList.findIndex(room => room.chatRoomName === chatRoomName);

  if (chatRoomIndex === -1) {
    // If chat room does not exist, create new chat room object in chatRoomList
    chatRoomList.push({ chatRoomName: chatRoomName, newMessages: [] });
    chatRoomIndex = chatRoomList.length - 1;

    // Create a new chat room in the Firebase Realtime Database
  }
  await createChatRoom(chatRoomName);

  // Get the messages from the chat room in the Firebase Realtime Database
  const messagesRef = admin.database().ref(chatRoom).child("messages");
  const snapshot = await messagesRef.once("value");
  snapshot.forEach((childSnapshot) => {
    const message = childSnapshot.val();
    messageList.push(message);
  });

  // Clear the new messages in the chat room object in chatRoomList
  chatRoomList[chatRoomIndex].newMessages = [];

  console.log("chatRoomList[chatRoomIndex].newMessages", chatRoomList[chatRoomIndex].newMessages);

   messageList = messageList.filter(message =>
    Object.values(message).every(value => value !== '')
  );
  
  return { messageList: messageList, userName: req.body.userName };
}
module.exports = { router, chatRoomList,openChatRom };
