
let currentOpenedChatRoom ="";
let intervalId;

window.onload = function(){
       
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

function openChatRom(userName){

        $.ajax("/openChatRoom",{
                "type":"POST",
                "data":{"userName":userName}
              })
              .done(function(response){
             

                if (!intervalId) {
                  intervalId = setInterval(() => {
                    getMessages();
                  }, 2000);
                }

                
              console.log(response)
               //vfrewq
               $('#addContactModel').modal('hide');

               // Select the <ul> element inside the <div> with ID "contacts"
                var ul = $('#contacts ul');

                // Create a new <li> element and append it to the <ul> element
                let getLastChatRoom = getChatRoomList();
                console.log("getLastChatRoom ", getLastChatRoom)
                console.log("getLastChatRoom[getLastChatRoom.length-1] ", getLastChatRoom[getLastChatRoom.length-1])

                currentOpenedChatRoom = getLastChatRoom[getLastChatRoom.length-1]
                ul.append(`<li class="contact active" onclick="loadExistingChat('${response.userName}','${getLastChatRoom[getLastChatRoom.length-1]}', this)" id="${getLastChatRoom[getLastChatRoom.length-1]}">
                <div class="wrap">
                    <span class="contact-status online"></span>
                    <img src="http://emilcarlsson.se/assets/mikeross.png" alt="">


                    <div class="meta">
                        <p class="name">${response.userName}</p>
                        <p class="preview"></p>
                        <p class="badge bg-danger"></p>
                    </div>
                </div>
            </li>`);

            var content = $('.content');
            content.html("");
            content.append(`
            <div class="contact-profile">
            <img src="http://emilcarlsson.se/assets/mikeross.png" alt="">

                <p>${response.userName}</p>
                <div class="social-media">
                    <i class="fa fa-facebook" aria-hidden="true"></i>
                    <i class="fa fa-twitter" aria-hidden="true"></i>
                     <i class="fa fa-instagram" aria-hidden="true"></i>
                </div>
            </div>
            <div class="messages">
                 <ul></ul>
            </div> 

            <div class="message-input">
                <div class="wrap">
                <input type="text" id="msg" placeholder="Write your message..." />
                <i class="fa fa-paperclip attachment" aria-hidden="true"></i>
                <button class="submit" onclick="sendMessage('${response.userName}')"><i class="fa fa-paper-plane" aria-hidden="true"></i></button>
                </div>
            </div>`)

            // Assuming 'messages' is an array of message objects
        for (let i = 0; i < response.messageList.length; i++) {
                const message =  response.messageList[i];
                const ul = $('.messages ul');
            
             
                if(message.receiver == response.userName){
                    ul.append(`    <li class="sent">
                    <img src="http://emilcarlsson.se/assets/mikeross.png" alt="">
                    <p>${message.text}</p>  </li>`) 
               
                   
                }else{
                    ul.append(`<li class="replies">
                    <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="">
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
         $.ajax("/sendChat",{
                "type":"POST",
                "data":{"userName":userName,"msg":msg}
              })
              .done(function(response){
              console.log(response)
              $("#msg").val("")
              $(".messages ul").append(`
              <li class="sent">
              <img src="http://emilcarlsson.se/assets/mikeross.png" alt="">

                  <p>${msg}</p>
              </li>`)
        })
        .fail(function(){
   
        console.log("fail")
        })
}



function getMessages(){
 
     $.ajax("/getChat",{
            "type":"POST",
            "data":{"chatRoomList":getChatRoomList()}
          })
          .done(function(response){
          console.log("chatRoomList   =  ",response)
          console.log("chatRoomList   =  ",currentOpenedChatRoom)
         
          var   newMessageList = getChatRoomsNewMessages()
          console.log("newMessagesList =  ",newMessageList) 
        for (var i = 0; i < newMessageList.length; i++) {
            console.log("response[i].chatRoomName   =  ",newMessageList[i].chatRoomName)

            if (newMessageList[i].chatRoomName == currentOpenedChatRoom) {
                const ul = $('.messages ul');
                for (var j = 0; j < newMessageList[i].newMessages.length; j++) {
                    //messages

                    const messagesDiv = document.querySelector(".messages");
                    const newMessageText = newMessageList[i].newMessages[j].text;

                    if (!messagesDiv.innerText.includes(newMessageText)) {
                        ul.append(`<li class="replies">
                        <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="">
                        <p>${newMessageText}</p>
                    </li>`) 
                        
                     }

                
                }
                 
    

            }else{
                var lis =  $('#contacts ul').find('li')
                for (var x = 0; x < lis.length; x++) { 
                    if (lis[x].id == newMessageList[i].chatRoomName) { 
                        var msgCounter = parseInt($(lis[x]).find('.wrap .meta p:last').text() || 0) + parseInt(newMessageList[i].newMessages.length);
                        console.log("msgCounter ",msgCounter)
                      var  notification = $(lis[x]).find('.wrap .meta p:last')
                      notification.text(msgCounter);
                      if(msgCounter > 0)
                           notification.css("display","inline")
                    else{ 
                        notification.css("display","none")
                    }
                    }
                }
            }

         newMessageList[i].newMessages = []
          
             
        }

        $.cookie('newMessagesList',"j:"+ JSON.stringify(newMessageList))
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


function loadExistingChat(userName,chatRoom,clickedLi){


    $.ajax("/openChatRoom",{
        "type":"POST",
        "data":{"userName":userName}
      })
      .done(function(response){
   

      console.log(response)
 
       // Select the <ul> element inside the <div> with ID "contacts"
        $('#contacts ul li').removeClass('active');
        currentOpenedChatRoom = chatRoom;
        $(clickedLi).addClass('active'); 
        var notification =  $(clickedLi).find('.wrap .meta p:last')
        notification.text("")
        notification.css("display","none")

    var content = $('.content');
    content.html("");
    content.append(`
    <div class="contact-profile">
    <img src="http://emilcarlsson.se/assets/mikeross.png" alt="">

        <p>${response.userName}</p>
        <div class="social-media">
            <i class="fa fa-facebook" aria-hidden="true"></i>
            <i class="fa fa-twitter" aria-hidden="true"></i>
             <i class="fa fa-instagram" aria-hidden="true"></i>
        </div>
    </div>
    <div class="messages">
         <ul></ul>
    </div> 

    <div class="message-input">
        <div class="wrap">
        <input type="text" id="msg" placeholder="Write your message..." />
        <i class="fa fa-paperclip attachment" aria-hidden="true"></i>
        <button class="submit" onclick="sendMessage('${response.userName}')"><i class="fa fa-paper-plane" aria-hidden="true"></i></button>
        </div>
    </div>`)

    // Assuming 'messages' is an array of message objects
for (let i = 0; i < response.messageList.length; i++) {
        const message =  response.messageList[i];
        const ul = $('.messages ul');
    
       
        if(message.receiver == response.userName){
            ul.append(`    <li class="sent">
            <img src="http://emilcarlsson.se/assets/mikeross.png" alt="">
            <p>${message.text}</p>  </li>`) 
       
           
        }else{
            ul.append(`<li class="replies">
            <img src="http://emilcarlsson.se/assets/harveyspecter.png" alt="">
            <p>${message.text}</p>
        </li>`)  
            
        }
     
     
 
}


      })
      .fail(function(){
 
      console.log("fail")
      })
}