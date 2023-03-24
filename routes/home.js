const express = require('express');
const router = express.Router();
var path = require("path");
const {admin}  = require("../AdminSdkfirebase");

const {openChatRom: openChatRom} = require('./openchatRoom.js');



function parseJwt (token) {
    return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}

// const userContacts = [{name: "Louis Litt", lastMsg: "You just got LITT up, Mike."},
// {name: "Assaf Assaf", lastMsg: "Hello how are you?"}];

 //let contact = [{name: "user3"},{name: "user4"}];
router.get("/",async function(req,res,next){
    let contact = []

    if (!req.cookies.jwt) {
        
        res.redirect("/login");
    }

    const jwt = parseJwt(req.cookies.jwt);
    let chatRooms = await getUserChatRoomsAndContatcs(req);
    console.log("from get /")
    console.log(contact)
    console.log("chatRooms",chatRooms)



await admin.auth().listUsers()
  .then((result) => {
    result.users.forEach((user) => {
        console.log(user.displayName);
        if(req.cookies.currentUser.userName !=user.displayName ) contact.push({name: user.displayName})
    });
  })
  .catch((error) => {
    console.log("Error fetching users:", error);
  });


  chatRooms.forEach((chatRoom) => {
    const index = contact.findIndex((c) => c.name === chatRoom.contactName);
    if (index !== -1) {
      contact.splice(index, 1);
    }
  });
  
  

    console.log("-----------------------")

    res.render("home", {name : jwt.name,chatRoomsList:chatRooms,contacts:contact});
});

router.post("/", function(req,res,next){
   // userContacts.push(req.body);
    console.log(req.body.userName)
    contact = contact.filter(e=> {
        return e.name !== req.body.userName;
    });
    // openChatRom(req,res)
    res.send("success");
});


async function getUserChatRoomsAndContatcs(req){
    console.log(req.cookies)
    const db = admin.database();
    const chatroomsRef = db.ref('chatRooms');
    let filteredChatrooms=[] ;
        
   await chatroomsRef.once('value')
            .then((snapshot) => {
                const chatrooms = snapshot.val();
                 if(chatrooms){
                    filteredChatrooms = Object.entries(chatrooms) 
                    .filter(([key, chatroom]) => key.includes(req.cookies.currentUser.userName))
                    .map(([key, chatroom]) => {
                        var contactName = key.split("-")
                    //    userContacts.push(contectName[0] == req.cookies.currentUser.userName ? contectName[1] : contectName[0])
                         contactName =   contactName[0] == req.cookies.currentUser.userName ? contactName[1] : contactName[0];
                    const messagesArray = Object.values(chatroom.messages) || []
                    .map(({ receiver, sender, text, timestamp }) => {
                            return { receiver, sender, text, timestamp };
                        });

                        return { name: key, messages: messagesArray ,contactName:contactName};
                    });
                    // filteredChatrooms = Object.entries(chatrooms) 
                    //                         .filter(([key, chatroom]) => {
                    //                             const messagesArray = Object.values(chatroom.messages || [])
                    //                             .map(({ receiver, sender, text, timestamp }) => {
                    //                                 return { receiver, sender, text, timestamp };
                    //                             })
                    //                             return key.includes(req.cookies.currentUser.userName) && messagesArray.length > 0;
                    //                         })
                    //                         .map(([key, chatroom]) => {
                    //                             var contactName = key.split("-")
                    //                             contactName = contactName[0] == req.cookies.currentUser.userName ? contactName[1] : contactName[0];
                    //                             const messagesArray = Object.values(chatroom.messages || [])
                    //                           //  .filter(message => Object.values(message).every(value => value !== ''))
                    //                             .map(({ receiver, sender, text, timestamp }) => {
                    //                                 return { receiver, sender, text, timestamp };
                    //                             });
                    //                             return { name: key, messages: messagesArray ,contactName:contactName};
                    //                         });

                    console.log("filteredChatrooms");

                    console.log(filteredChatrooms);
                    console.log("-----------------------------------------");

                    // console.log(JSON.stringify(filteredChatrooms, null, 2)
                    // .replace(/"(messages)": \[/g, "$1: [Object]"));
                 }
         
            })
            .catch((error) => {
                console.error(error);
            });


  return filteredChatrooms;
}

module.exports = router;
