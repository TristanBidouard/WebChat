//Framework imports
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const moment = require('moment');
var path = require('path');
var mongoose = require('mongoose');
var assert = require('assert');

//Custom Imports
var users = require('./users.js');

//Global variables
var PORT = process.env.PORT || 3000;
var ROOT_PATH = path.resolve(__dirname, '../..');
var PUBLIC_PATH = ROOT_PATH + '/public';
var HTML_PATH = PUBLIC_PATH + '/html';
var CSS_PATH = PUBLIC_PATH + '/css';
var JS_PATH = PUBLIC_PATH + '/js';
var LOGIN_PAGE = "/login.html"
var CHAT_PAGE = "/chat.html"
var REG_PAGE = "/register.html"

var DB_NAME = "WebChatUsers";
var DB_URL = "mongodb+srv://Tristan:MYPASSWORD@cluster0.6pttu.mongodb.net/" + DB_NAME + "?retryWrites=true&w=majority";
var LAST_USERNAME = "";

//-------------------------------------------------

//Define the public folder
app.use(express.static(ROOT_PATH + '/public'));

//Launch the server
http.listen(PORT, function(){
	console.log(' ');
	console.log('[STARTED] Waiting for connections...');
});


//Get request redirect
app.get('/', function(req, res){
  res.sendFile(HTML_PATH + LOGIN_PAGE);
});


//Modify route if client is not logged
function loggedIn(req, res, next) {
  if(true) { //TO DO
  	console.log(req);
  	console.log(res);
    next();
  } else {
    res.sendFile(HTML_PATH + LOGIN_PAGE);
  }
}

app.get('/chat', loggedIn, function(req, res){
  res.sendFile(HTML_PATH + CHAT_PAGE);
});

app.get('/register', function(req, res){
  res.sendFile(HTML_PATH + REG_PAGE);
});


//-------------------------------------------------

//Disable warnings during the connection
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
//Connect database
mongoose.connect(DB_URL, (err) => { 
   console.log('[STARTED] Database is connected');
   console.log(' ');
})

//User data format
var userSchema = new mongoose.Schema({ username : String, password : String});
//User data model
var userModel = mongoose.model('user', userSchema);

//-------------------------------------------------

//Client connection
io.on('connection', function(socket){

	//Client username
	var username;

	//Save client username when he's disconnected from the server during login to chat redirect
	if(LAST_USERNAME != ""){
		//Send the username
		socket.emit('usernameGet', LAST_USERNAME);
	}

	//-------------------------------------------------

	//CLient Username received 
	socket.on('username', function(txt){

		//Modify the client username
		username = txt;

		//Add client to users
		const user = users.userJoin(socket.id, username);

		//Send connected users
		io.emit('connected users', users.getUsers());
		
		//Log connection in server
		console.log("[LOGIN]" + username + " connected to the server");

		//Send log connection for the user
		//socket.emit('server message', username + ' connected to the server', 'INFO', moment().format('HH:mm'));
	
		//Send log connection for all the users excpet him
		socket.broadcast.emit('server message', username + ' connected to the server', 'INFO', moment().format('HH:mm'));

		//Client disconnection
		socket.on('disconnect', function(){

			//Send log disconnection in server
			console.log("[DISCONNECTION]" + username + " disconnected");

			//Send log disconnection for all the users excpet him
			socket.broadcast.emit('server message', username + ' has left the chat', 'INFO', moment().format('HH:mm'));

			//Remove client to users
			users.userLeave(socket.id);

			//Send connected users
			socket.broadcast.emit('connected users', users.getUsers());
		})

	})

	//-------------------------------------------------

	//Client message received
	socket.on('chat message', function(msg){

		//Log received message in server
		console.log(username + " : " + msg);

		//Send message to all of the users
		socket.emit('mymessage', msg, username, moment().format('HH:mm'));
		socket.broadcast.emit('chat message', msg, username, moment().format('HH:mm'));
	})

	//-------------------------------------------------

	//Authentification request
	socket.on('auth request', function(name, psw){

		//Send log authentification in server
		console.log("[AUTHENTIFICATION REQ] Username : " + name);
		console.log("[AUTHENTIFICATION REQ] Password : " + psw);


		userModel.find({username: name, password : psw}).then(function (docs) {
			if(docs.length == 0){
				socket.emit("auth response", false);
			}else{
				socket.emit("auth response", true);
			}
		}); 
		

		
	})

	//-------------------------------------------------

	//Register request
	socket.on('reg request', function(name, psw){

		//Send log authentification in server
		console.log("[REGISTER REQ] Username : " + name);
		console.log("[REGISTER REQ] Password : " + psw);
		
		userModel.find({username: name}).then(function (docs) {
			if(docs.length == 0){
				var user = new userModel({username : name, password : psw});
				user.save();

				console.log("[ADD USER] Username : " + name);
				console.log("[ADD USER] Password : " + psw);
				socket.emit("reg response", true);
			}else{
				console.log("[REGISTER REQ] Username : " + name + " already exists!");
				socket.emit("reg response", false);
			}
		}); 

		
	})

	//-------------------------------------------------

	//Receive the username
	socket.on('usernameSet', function(name){
		LAST_USERNAME = name;
	})


	
})
