//Import io to be able to connect to the server 
var socket = io();

/*---------------------------------------------------*/
/*----------------------- SEND ----------------------*/
/*---------------------------------------------------*/

//Prevents page reloading when button clicked
document.getElementById("login-button").addEventListener("click", function(event){
  event.preventDefault();
});


//Send message to the server
var send = function(){

  //get username and password values
  var username = document.getElementById('username-input');
  var password = document.getElementById('password-input');
  var error = document.getElementById('error');
  username.style.border = "none";
  password.style.border = "none";
  error.style.display = "none";

  var format = true;

  //Check if username and password are not empty
  if(username.value == "" || username.value == null){
    username.style.border = "solid";
    username.style.borderColor = "red";
    username.style.borderWidth = "thin";
    format = false;
  }
  if(password.value == "" || password.value == null){
    password.style.border = "solid";
    password.style.borderColor = "red";
    password.style.borderWidth = "thin";
    format = false;
  }

  if(format){
    socket.emit('auth request', username.value, password.value);
  }

}

var register = function(){

  //Change login to chat page
  window.location= "register";

}

/*---------------------------------------------------*/
/*--------------------- RECEIVE ---------------------*/
/*---------------------------------------------------*/

//Receive authorization from server
var receiveAuth = function(bool){

  var username = document.getElementById('username-input');
  var password = document.getElementById('password-input');
  var error = document.getElementById('error');

  if(bool){

    //Change login to chat page
    socket.emit('usernameSet', username.value);
    window.location= "chat";

  }else{

    // Logging error
    username.style.border = "solid";
    username.style.borderColor = "red";
    username.style.borderWidth = "thin";
    password.style.border = "solid";
    password.style.borderColor = "red";
    password.style.borderWidth = "thin";
    error.style.display = "block";

  }
}

socket.on('auth response', receiveAuth);

/*---------------------------------------------------*/

//Enter to login
$("#username-input").on('keyup', function (event) {
  if (event.keyCode === 13) {
     send();
  }
});
$("#password-input").on('keyup', function (event) {
  if (event.keyCode === 13) {
     send();
  }
});





