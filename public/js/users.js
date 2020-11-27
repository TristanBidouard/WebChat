//List of connected users
const users = [];

//User class
class User {
	constructor(id, username){
		this.id = id;
		this.username = username;
		this.auth = false;
	}
}

// User joins chat
function userJoin(id, username) {

	var user = new User(id, username);
	users.push(user);
	return user;
}

// User leaves chat
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}


function displayUsers(){
	users.forEach(user => console.log(user));
}

function getUsers(){
	return users;
}


module.exports = {
	getUsers,
	userJoin,
	userLeave,
	displayUsers,
};