//Import io to be able to connect to the server 
var socket = io();

/*---------------------------------------------------*/
/*----------------------- SEND ----------------------*/
/*---------------------------------------------------*/

//Prevents page reloading when button clicked
document.getElementById("register-button").addEventListener("click", function(event){
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
    socket.emit('reg request', username.value, password.value);
  }
}

/*---------------------------------------------------*/
/*--------------------- RECEIVE ---------------------*/
/*---------------------------------------------------*/

//Receive register response from server
var regState = function(bool){

  var username = document.getElementById('username-input');
  var register = document.getElementById('register-button');
  var error = document.getElementById('error');

  //Registering status
  if(bool){

    // Registering done
    register.textContent = 'Created!'
    register.style.background = "#008000";
    setTimeout(function() {
      //Change login to chat page
      window.location= "/";
    }, 1000);

  }else{

    // Registering error
    username.style.border = "solid";
    username.style.borderColor = "red";
    username.style.borderWidth = "thin";
    error.textContent = username.value + " already exists!"
    error.style.display = "block";
  }
}

socket.on('reg response', regState);

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






