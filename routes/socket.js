let instance = null;

class UserManager {
	constructor() {
		if (!instance) {
			instance = this;
		}
		this.users = {};
		this.userArray = [];

		return instance;
	}

	claim(name) {
		if (!name || this.users[name]) {
			return false;
		} else {
			this.users[name] = true;
			return true;
		}
	}

	getGuestName() {
		let name, nextUserId = 1;

		do {
			name = 'Guest ' + nextUserId;
			nextUserId += 1;
		} while(!this.claim(name));

		return name;
	}

	addUser(user) {
		this.userArray.push(user);
	}

	getUsers() {
		return this.userArray;
	}

	free(user) {
		if(this.users[user.name]) {
			delete this.users[user.name];
			let index = this.userArray.indexOf(user);
			this.userArray.splice(index, 1);
		}
	}
}

import util from 'util';

const socketHandler = function(socket) {
	let userManager = new UserManager();
	var name = userManager.getGuestName();
	const id = socket.id;

	var user = {
		name: name,
		isIdled: false
	};

	userManager.addUser(user);

	socket.emit('init', {
		user: user,
		users: userManager.getUsers()
	});

	socket.broadcast.emit('user:join', {
		user: user
	});

	socket.on('send:message', function(data) {
		socket.broadcast.emit('send:message', data);
	});

	socket.on('user:idle', function(data) {
		let users = userManager.getUsers();
		users.forEach(function(u) {
			if (u.name === data.name) {
				u.isIdled = data.isIdled;
			}
		});
		
		socket.broadcast.emit('idleusers', {
			users
		});

		socket.emit('idleusers', {users});
	});

	socket.on('image:upload', function(data) {
		console.log('uploaded image ' + data.image);
		socket.broadcast.emit('image:display', data); // Send to everyone else except sender
		socket.emit('image:display', data); // Send to the sender
	});

	socket.on('disconnect', function() {
		socket.broadcast.emit('user:left', {
			user: user
		});
		userManager.free(user);
	});

	socket.on('error', function(msg) {
		console.log('error message:' + msg);
	})
};

export default socketHandler;
