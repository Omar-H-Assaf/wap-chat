
let currentOpenedChatRoom ="";

  // Set up the setInterval after the page has loaded
  window.addEventListener('load', () => {

    let intervalId = null;

    function startInterval() {
      if (!intervalId) {
        intervalId = setInterval(() => {
          getMessages();
          console.log('Interval triggered!');
        }, 2000);
      }
    }
  
    function stopInterval() {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }
  

  
    startInterval(); 

      // Stop interval when user navigates away from page
  window.addEventListener('unload', () => {
    stopInterval();
  });

  });

window.onload = function(){
       
    const liId = $('#contacts ul li.active').attr('id').replaceAll('\'', '');
    currentOpenedChatRoom = liId
console.log(liId); // outputs "cheikh-user3"

    var cookieData = $.cookie('currentUser');
     var jsonData = cookieData.substring(2); // remove the 'j:' prefix
     var data = JSON.parse(jsonData);
     console.log(data);
     $("#currentUserName").html(data.userName)
 //      $("#profile-img").attr("data-letters", `${data.userName.charAt(0)}`);

 }
function showAddContactPopUp(){   
        $('#addContactModel').modal('show');
}
function addContact(){

        let userName = $("#userName").val()

      $.ajax("/findUser",{
          "type":"POST",
          "data":{"userName":userName}
        })
        .done(function(response){
        console.log(response)
  
        if(response){
            openChatRom(userName);
        }else{
                $("#alert-success").html('No users with username   '+userName)
                $("#alert-success").show();
                setTimeout(function(){
                  $("#alert-success").hide();
                },2000)     
        }
        })
        .fail(function(){
   
        console.log("fail")
        })

}

async function openChatRom(userName){

        $.ajax("/openChatRoom",{
                "type":"POST",
                "data":{"userName":userName}
              })
              .done(function(response){
             


                
              console.log(response)
               //vfrewq
               $('#myForm').css('display','none');
               
               // Select the <ul> element inside the <div> with ID "contacts"
                var ul = $('#contacts ul');

                // Create a new <li> element and append it to the <ul> element
                let getLastChatRoom = getChatRoomList();
                console.log("getLastChatRoom ", getLastChatRoom)
                console.log("getLastChatRoom[getLastChatRoom.length-1] ", getLastChatRoom[getLastChatRoom.length-1])

                currentOpenedChatRoom = getLastChatRoom[getLastChatRoom.length-1]
                ul.append(`<li class="contact active" onclick="loadExistingChat('${response.userName}','${getLastChatRoom[getLastChatRoom.length-1]}')" id="${getLastChatRoom[getLastChatRoom.length-1]}">
                <div class="wrap">
                    <div id="profile-img">
                         ${response.userName.charAt(0)}
                    </div>
                    <div class="meta">
                        <p id="contact-name" class="name"> ${response.userName}</p>
                        <p class="preview"></p>
                    </div>
                </div>
            </li>`);

            var content = $('.content');
            content.html("");
            // content.append(`
            // <div class="contact-profile">

            //     ${response.userName.charAt(0)}
            //     <p> ${response.userName}</p>
            // </div>
            // <div class="messages">
            //      <ul></ul>
            // </div> 

            // <div class="message-input">
            //     <div class="wrap">
            //     <input type="text" id="msg" placeholder="Write your message..." />
            //     <button class="submit" onclick="sendMessage('${response.userName}')"><i class="login__icon fa fa-paper-plane" aria-hidden="true"></i></button>
            //     </div>
            // </div>`)

            // Assuming 'messages' is an array of message objects
        // for (let i = 0; i < response.messageList.length; i++) {
        //         const message =  response.messageList[i];
        //         const ul = $('.messages ul');
            
             
        //         if(message.receiver == response.userName){
        //             ul.append(`    <li class="sent">
        //             <p>${message.text}</p>  </li>`) 
               
                   
        //         }else{
        //             ul.append(`<li class="replies">
                 
        //             <p>${message.text}</p>
        //         </li>`)  
                    
        //         }
             
         
        // }
        content.append(`
        <div class="contact-profile">
        
           <div id="profile-img">
                ${response.userName.charAt(0)}
            </div>
            <p> ${response.userName}</p>
        
        </div>
        
        <div class="messages">
             <ul></ul>
        </div> 
        
        <div class="message-input">
            <div class="wrap">
            <input type="text"  id="msg" placeholder="Write your message..." />
            <button class="submit" onclick="sendMessage('${response.userName}')"><i class="login__icon fa fa-paper-plane" aria-hidden="true"></i></button>
            </div>
        </div>`)
        
        // Assuming 'messages' is an array of message objects
        for (let i = 0; i < response.messageList.length; i++) {
            const message =  response.messageList[i];
            const ul = $('.messages ul');
        
            if(message.receiver == response.userName){
                ul.append(`    <li class="sent">
                <p>${message.text}</p>  </li>`) 
           
               
            }else{
                ul.append(`<li class="replies">
             
                <p>${message.text}</p>
            </li>`)  
                
            }
         
        
        }

              })
              .fail(function(){
         
              console.log("fail")
              })
      
}


function sendMessage(userName){
        let msg = $("#msg").val()
        if (msg.trim() === '') {
            return; // exit the function if input is empty
          }
         $.ajax("/sendChat",{
                "type":"POST",
                "data":{"userName":userName,"msg":msg}
              })
              .done(function(response){
              console.log(response)
              $("#msg").val("")
              $(".messages ul").append(`
              <li class="sent">
                  <p>${msg}</p>
              </li>`)
              var messageDiv = $('.messages');
                       messageDiv.scrollTop(messageDiv[0].scrollHeight);

        })
        .fail(function(){
   
        console.log("fail")
        })
}




// function getMessages(){
 
//      $.ajax("/getChat",{
//             "type":"POST",
//             //"data":{"chatRoomList":getChatRoomList()}
//             "data":{}
//           })
//           .done(function(response){
//           console.log("chatRoomList (response)   =  ",response)
//           console.log("currentOpenedChatRoom   =  ",currentOpenedChatRoom)
//           addResponseToPastMessages(response);

//           var   newMessageList = pastMessages || [] //getChatRoomsNewMessages()
//          // console.log("newMessagesList =  ",newMessageList) 
//         for (var i = 0; i < newMessageList.length; i++) {
//          if(newMessageList[i].isRead === false) {
//             console.log("response[i].chatRoomName   =  ",newMessageList[i].chatRoomName)
//             if (newMessageList[i].chatRoomName == currentOpenedChatRoom) {
//                 const ul = $('.messages ul');
//                 //for (var j = 0; j < newMessageList[i].chatRoomName.length; j++) {
//                     //messages
                    
//                     ul.append(`<li class="replies">
//                          <p>${newMessageList[i].message.text}</p>
//                      </li>`) 
//                     // const messagesDiv = document.querySelector(".messages");
//                     // const newMessageText = newMessageList[i].newMessages[j].text;

//                     // if (!messagesDiv.innerText.includes(newMessageText)) {
//                     //     ul.append(`<li class="replies">
//                     //     <p>${newMessageText}</p>
//                     // </li>`) 
                        
//                     //  }

                
//                 //}
                 
    

//             }else{
//                 var lis =  $('#contacts ul').find('li')
//                 for (var x = 0; x < lis.length; x++) { 
//                     if (lis[x].id == newMessageList[i].chatRoomName) { 
//                         var msgCounter = parseInt($(lis[x]).find('.wrap .meta p:last').text() || 0) + 1 //parseInt(newMessageList[i].newMessages.length);
//                         console.log("msgCounter ",msgCounter)
//                       var  notification = $(lis[x]).find('.wrap .meta p:last')                      
//                         if (notification.has('span').length) {
//                         // The notification has a span element
//                         var firstSpan = notification.find('span').first();
//                         firstSpan.text(msgCounter)
//                         } else {
//                         notification.html(`<span class="badge bg-danger">${msgCounter}</span>`);

//                         }


//                       if(msgCounter > 0)
//                            notification.css("display","inline")
//                     else{ 
//                         notification.css("display","none")
//                         notification.html("")
//                     }
//                     }
//                 }
//             }

//          //newMessageList[i].newMessages = []
          
//         }
//         newMessageList[i].isRead = true;
   
//         }

//         $.cookie('newMessagesList',"j:"+ JSON.stringify(newMessageList))
//     })
//     .fail(function(){

//     console.log("fail")
//     })
// }

let pastMessages =[]

function addResponseToPastMessages(response) {
    response.forEach((messageObject) => {
      if (!pastMessages.some((m) => m.message === messageObject.message)) {
        pastMessages.push(messageObject);
      }
    });
  }
function getMessages(){
 
    $.ajax("/getChat",{
           "type":"POST",
           //"data":{"chatRoomList":getChatRoomList()}
           "data":{}
         })
         .done(function(response){
         console.log("chatRoomList (response)   =  ",response)
         console.log("currentOpenedChatRoom   =  ",currentOpenedChatRoom)
         addResponseToPastMessages(response);

         var newMessageList = pastMessages || [] //getChatRoomsNewMessages()
        // console.log("newMessagesList =  ",newMessageList) 
       for (var i = 0; i < newMessageList.length; i++) {
        console.log("newMessageList[i].isRead === false ,",newMessageList[i].isRead === false)
        if(newMessageList[i].isRead === false) {
           console.log("response[i].chatRoomName   =  ",newMessageList[i].chatRoomName)
           if (newMessageList[i].chatRoomName == currentOpenedChatRoom) {
               const ul = $('.messages ul');
               //for (var j = 0; j < newMessageList[i].chatRoomName.length; j++) {
                   //messages
                   
                   ul.append(`<li class="replies">
                        <p>${newMessageList[i].message.text}</p>
                    </li>`) 
                   // const messagesDiv = document.querySelector(".messages");
                   // const newMessageText = newMessageList[i].newMessages[j].text;

                   // if (!messagesDiv.innerText.includes(newMessageText)) {
                   //     ul.append(`<li class="replies">
                   //     <p>${newMessageText}</p>
                   // </li>`) 
                       
                   //  }

               
               //}
                
   

           } else {
               var lis =  $('#contacts ul').find('li')
               for (var x = 0; x < lis.length; x++) { 
                   if (lis[x].id == newMessageList[i].chatRoomName) { 
                       var msgCounter = parseInt($(lis[x]).find('.wrap .meta p:last').text() || 0) + 1 //parseInt(newMessageList[i].newMessages.length);
                       console.log("msgCounter ",msgCounter)
                       var notification = $(lis[x]).find('.wrap .meta p:last')                      
                       if (notification.has('span').length) {
                           // The notification has a span element
                           var firstSpan = notification.find('span').first();
                           firstSpan.text(msgCounter)
                       } else {
                           notification.html(`<span class="badge bg-danger">${msgCounter}</span>`);
                       }

                       if (msgCounter > 0) {
                           notification.css("display","inline")
                       } else { 
                           notification.css("display","none")
                           notification.html("")
                       }

                      
                   }
               }
           }
        }
        newMessageList[i].isRead = true; // Move this line inside the if block
       }

      // $.cookie('newMessagesList',"j:"+ JSON.stringify(newMessageList))
   })
   .fail(function(){

   console.log("fail")
   })
}

function getChatRoomList(){
    var cookieData = $.cookie('chatRoomList');
    var jsonData = cookieData.substring(2); // remove the 'j:' prefix
    var chatRoomList = JSON.parse(jsonData);
    console.log("chatRoomList from getChatRoomList() ",chatRoomList);

    return chatRoomList;
}
function getChatRoomsNewMessages(){
    var cookieData = $.cookie('newMessagesList');
    var jsonData = cookieData.substring(2); // remove the 'j:' prefix
    var newMessagesList = JSON.parse(jsonData);
    console.log("newMessagesList from getChatRoomsNewMessages() ",newMessagesList);

    return newMessagesList;
}


function loadExistingChat(userName,chatRoom){


    $.ajax("/openChatRoom",{
        "type":"POST",
        "data":{"userName":userName}
      })
      .done(function(response){
   

      console.log("openChatRoom response == "+response)
 
       // Select the <ul> element inside the <div> with ID "contacts"
        $('#contacts ul li').removeClass('active');
        currentOpenedChatRoom = chatRoom;
        $(`#${chatRoom}`).addClass('active'); 
        var notification =  $(`#${chatRoom}`).find('.wrap .meta p:last')
        notification.html(``)
        notification.css("display","none")

    var content = $('.content');
    content.html("");
    // content.append(`
    // <div class="contact-profile">

    //     <p>${response.userName}</p>
   
    // </div>
    // <div class="messages">
    //      <ul></ul>
    // </div> 

    // <div class="message-input">
    //     <div class="wrap">
    //     <input type="text" id="msg" placeholder="Write your message..." />
    //     <i class="fa fa-paperclip attachment" aria-hidden="true"></i>
    //     <button class="submit" onclick="sendMessage('${response.userName}')"><i class="fa fa-paper-plane" aria-hidden="true"></i></button>
    //     </div>
    // </div>`)

    // Assuming 'messages' is an array of message objects
// for (let i = 0; i < response.messageList.length; i++) {
//         const message =  response.messageList[i];
//         const ul = $('.messages ul');   
//         if(message.receiver == response.userName){
//             ul.append(`    <li class="sent">
//             <p>${message.text}</p>  </li>`)     
//         }else{
//             ul.append(`<li class="replies">
//             <p>${message.text}</p>
//         </li>`)  
            
//         }
    
// }

content.append(`
<div class="contact-profile">

   <div id="profile-img">
        ${response.userName.charAt(0)}
    </div>
    <p> ${response.userName}</p>

</div>

<div class="messages">
     <ul></ul>
</div> 

<div class="message-input">
    <div class="wrap">
    <input type="text"  id="msg" placeholder="Write your message..." />
    <button class="submit" onclick="sendMessage('${response.userName}')"><i class="login__icon fa fa-paper-plane" aria-hidden="true"></i></button>
    </div>
</div>`)

// Assuming 'messages' is an array of message objects
for (let i = 0; i < response.messageList.length; i++) {
    const message =  response.messageList[i];
    const ul = $('.messages ul');

    if(message.receiver == response.userName){
        ul.append(`    <li class="sent">
        <p>${message.text}</p>  </li>`) 
   
       
    }else{
        ul.append(`<li class="replies">
     
        <p>${message.text}</p>
    </li>`)  
        
    }
 

}

      })
      .fail(function(){
 
      console.log("fail")
      })
}




function search(){
    let input = document.getElementById('searchbar').value
    input=input.toLowerCase();
    const contactList = document.getElementsByClassName("contact");

    for (i = 0; i < contactList.length; i++) { 
        if (!contactList[i].childNodes[1].childNodes[3].childNodes[1].innerText.toLowerCase().includes(input)) {
            contactList[i].style.display="none";
        } else {
            contactList[i].style.display="block";
        }
    }
}

function openForm() {
        document.getElementById("myForm").style.display = "block";
    }

function closeForm() {
    document.getElementById("myForm").style.display = "none";
}

async function addUser(userName,li) {
    var button = $(event.target);

    $(button).closest("li").css("display", "none");

    await openChatRom(userName);
    // $.ajax("/", {
    //         "type": "POST",
    //         "data": {
    //             "userName": userName
    //         },
    //     }).done(function (response) {
    //      //   location.reload();
    //     })
    //         .fail(function () {
    //           alert("error occured please try again later");
    //         });
}



function logOut() {
    $.ajax("/login", {
          "type": "GET",
      }).done(function (response) {
         window.location.href = 'login'
      })
          .fail(function () {
           console.log("fail");
          });
 }