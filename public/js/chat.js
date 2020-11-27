//Import io to be able to connect to the server 
var socket = io();


//DOM elements
var chat = document.getElementById("chat");
var usersContainer = document.getElementById("users-container");


//Scroll to the bottom
chat.scrollTop = chat.scrollHeight;
var MY_USERNAME = " ";



/*---------------------------------------------------*/
/*----------------------- SEND ----------------------*/
/*---------------------------------------------------*/

//Prevents page reloading when button clicked
document.getElementById("send-button").addEventListener("click", function(event){
  event.preventDefault()
});


//Send message to the server
var send = function(){
  var text = document.getElementById('text-message').value;
  socket.emit('chat message', text);
  document.getElementById('text-message').value = '';
}


//Enter to send the message
$("#text-message").on('keyup', function (event) {
  if (event.keyCode === 13) {
     send();
  }
});


/*---------------------------------------------------*/
/*--------------------- RECEIVE ---------------------*/
/*---------------------------------------------------*/

//Receive message from the server
var receiveMyMessage = function(msg, username, time){

  //Add a message div in HTML page
  var rowDiv = document.createElement('div');
  rowDiv.classList.add('mymessage-row');
  let innerText = '\
  <div class="mymessage-container">\
    <div class="myusername">'+ username +'</div>\
     <div class="mymessage">'+ msg +'</div>\
     <div class="mytime">'+ time +'</div>\
 </div>';
 rowDiv.innerHTML = innerText;
 chat.appendChild(rowDiv);

 //Scroll to the bottom
  chat.scrollTop = chat.scrollHeight;
}



//Receive message from the server
var receiveChat = function(msg, username, time){

  //Row div creation
  var rowDiv = document.createElement('div');
  rowDiv.classList.add('chatmessage-row');

  //Add html in row div
  let innerText = '\
  <div class="chatmessage-container">\
    <div class="chatusername">'+ username +'</div>\
     <div class="chatmessage">'+ msg +'</div>\
     <div class="chattime">'+ time +'</div>\
 </div>';
 rowDiv.innerHTML = innerText;
 chat.appendChild(rowDiv);

 //Scroll to the bottom
  chat.scrollTop = chat.scrollHeight;
}

//Receive message from the server
var info = function(msg, username, time){

  //Row div creation
  var rowDiv = document.createElement('div');
  rowDiv.classList.add('mymessage-row');

  //Add html in row div
  let innerText = '\
  <div class="mymessage-container">\
    <div class="myusername">'+ username +'</div>\
     <div class="mymessage">'+ msg +'</div>\
     <div class="mytime">'+ time +'</div>\
 </div>';
 rowDiv.innerHTML = innerText; 
 chat.appendChild(rowDiv);

 //Scroll to the bottom
  chat.scrollTop = chat.scrollHeight;

}

//Receive message from the server
var receiveConnectedUsers = function(users){

  console.log("REMOVE USERS");
  var usersHTML = document.getElementsByClassName('user-container');
  for (var i = usersHTML.length - 1; i >= 0; --i) {
    console.log(usersHTML[i]);
    usersHTML[i].remove();
  }
  console.log("END REMOVE");


  console.log("ADD USER");
  users.forEach((user) => {

    //Row div creation
    var userDiv = document.createElement('div');
    userDiv.classList.add('user-container');

    let innerText;
    if(user.username == MY_USERNAME){
      innerText = '\
      <div class="connected-logo-container"=>\
        <svg class="connected-logo" viewBox="0 0 600 600">\
          <path d="m210.351562 246.632812c33.882813 0 63.222657-12.152343 87.195313-36.128906 23.972656-23.972656 36.125-53.304687 36.125-87.191406 0-33.875-12.152344-63.210938-36.128906-87.191406-23.976563-23.96875-53.3125-36.121094-87.191407-36.121094-33.886718 0-63.21875 12.152344-87.191406 36.125s-36.128906 53.308594-36.128906 87.1875c0 33.886719 12.15625 63.222656 36.132812 87.195312 23.976563 23.96875 53.3125 36.125 87.1875 36.125zm0 0"/>\
          <path d="m426.128906 393.703125c-.691406-9.976563-2.089844-20.859375-4.148437-32.351563-2.078125-11.578124-4.753907-22.523437-7.957031-32.527343-3.308594-10.339844-7.808594-20.550781-13.371094-30.335938-5.773438-10.15625-12.554688-19-20.164063-26.277343-7.957031-7.613282-17.699219-13.734376-28.964843-18.199219-11.226563-4.441407-23.667969-6.691407-36.976563-6.691407-5.226563 0-10.28125 2.144532-20.042969 8.5-6.007812 3.917969-13.035156 8.449219-20.878906 13.460938-6.707031 4.273438-15.792969 8.277344-27.015625 11.902344-10.949219 3.542968-22.066406 5.339844-33.039063 5.339844-10.972656 0-22.085937-1.796876-33.046874-5.339844-11.210938-3.621094-20.296876-7.625-26.996094-11.898438-7.769532-4.964844-14.800782-9.496094-20.898438-13.46875-9.75-6.355468-14.808594-8.5-20.035156-8.5-13.3125 0-25.75 2.253906-36.972656 6.699219-11.257813 4.457031-21.003906 10.578125-28.96875 18.199219-7.605469 7.28125-14.390625 16.121094-20.15625 26.273437-5.558594 9.785157-10.058594 19.992188-13.371094 30.339844-3.199219 10.003906-5.875 20.945313-7.953125 32.523437-2.058594 11.476563-3.457031 22.363282-4.148437 32.363282-.679688 9.796875-1.023438 19.964844-1.023438 30.234375 0 26.726562 8.496094 48.363281 25.25 64.320312 16.546875 15.746094 38.441406 23.734375 65.066406 23.734375h246.53125c26.625 0 48.511719-7.984375 65.0625-23.734375 16.757813-15.945312 25.253906-37.585937 25.253906-64.324219-.003906-10.316406-.351562-20.492187-1.035156-30.242187zm0 0"/>\
        </svg>\
      </div>\
      <div class="user-name-container">\
        <div class="myuser-name">'+ user.username +'</div>\
      </div>';
    }else{
      innerText = '\
      <div class="connected-logo-container"=>\
        <svg class="connected-logo" viewBox="0 0 600 600">\
          <path d="m210.351562 246.632812c33.882813 0 63.222657-12.152343 87.195313-36.128906 23.972656-23.972656 36.125-53.304687 36.125-87.191406 0-33.875-12.152344-63.210938-36.128906-87.191406-23.976563-23.96875-53.3125-36.121094-87.191407-36.121094-33.886718 0-63.21875 12.152344-87.191406 36.125s-36.128906 53.308594-36.128906 87.1875c0 33.886719 12.15625 63.222656 36.132812 87.195312 23.976563 23.96875 53.3125 36.125 87.1875 36.125zm0 0"/>\
          <path d="m426.128906 393.703125c-.691406-9.976563-2.089844-20.859375-4.148437-32.351563-2.078125-11.578124-4.753907-22.523437-7.957031-32.527343-3.308594-10.339844-7.808594-20.550781-13.371094-30.335938-5.773438-10.15625-12.554688-19-20.164063-26.277343-7.957031-7.613282-17.699219-13.734376-28.964843-18.199219-11.226563-4.441407-23.667969-6.691407-36.976563-6.691407-5.226563 0-10.28125 2.144532-20.042969 8.5-6.007812 3.917969-13.035156 8.449219-20.878906 13.460938-6.707031 4.273438-15.792969 8.277344-27.015625 11.902344-10.949219 3.542968-22.066406 5.339844-33.039063 5.339844-10.972656 0-22.085937-1.796876-33.046874-5.339844-11.210938-3.621094-20.296876-7.625-26.996094-11.898438-7.769532-4.964844-14.800782-9.496094-20.898438-13.46875-9.75-6.355468-14.808594-8.5-20.035156-8.5-13.3125 0-25.75 2.253906-36.972656 6.699219-11.257813 4.457031-21.003906 10.578125-28.96875 18.199219-7.605469 7.28125-14.390625 16.121094-20.15625 26.273437-5.558594 9.785157-10.058594 19.992188-13.371094 30.339844-3.199219 10.003906-5.875 20.945313-7.953125 32.523437-2.058594 11.476563-3.457031 22.363282-4.148437 32.363282-.679688 9.796875-1.023438 19.964844-1.023438 30.234375 0 26.726562 8.496094 48.363281 25.25 64.320312 16.546875 15.746094 38.441406 23.734375 65.066406 23.734375h246.53125c26.625 0 48.511719-7.984375 65.0625-23.734375 16.757813-15.945312 25.253906-37.585937 25.253906-64.324219-.003906-10.316406-.351562-20.492187-1.035156-30.242187zm0 0"/>\
        </svg>\
      </div>\
      <div class="user-name-container">\
        <div class="user-name">'+ user.username +'</div>\
      </div>';
    }
    
   userDiv.innerHTML = innerText; 
   usersContainer.appendChild(userDiv);
  })
  console.log("END ADD");
}

//Receive username from server when client is disconnected during login to chat redirect
var receiveMyUsername = function(username){
  MY_USERNAME = username;
  socket.emit("username", username);
}

socket.on('chat message', receiveChat);
socket.on('mymessage', receiveMyMessage);
socket.on('server message', info);
socket.on('connected users', receiveConnectedUsers);
socket.on('usernameGet', receiveMyUsername);




