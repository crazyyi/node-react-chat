import React from 'react';
import MessageBoard from './components/MessageBoard';
import MessageForm from './components/MessageForm';
import UserList from './components/UserList';
import ImageUploadForm from './components/ImageUploadForm';
import styles from './App.css';

var socket = io();

const IDLE_TIMEOUT = 30;
const SYSTEM = 'System: ';
var idleSecondsCounter = 0;
var idleSecondsTimer = null;
var counterUpdated = false;

const VERSION = 1.0;

document.onclick = function() {
  idleSecondsCounter = 0;
  counterUpdated = true;
};

document.onmousemove = function() {
  idleSecondsCounter = 0;
  counterUpdated = true;
};

document.onkeypress = function() {
  idleSecondsCounter = 0;
  counterUpdated = true;
};

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      messages: [],
      body: '',
      user: {}
    };
    this._displayUploadedImage = this._displayUploadedImage.bind(this);
    idleSecondsTimer = window.setInterval(this.checkIdleTime.bind(this), 1000);
  }

  componentDidMount() {
    socket.on('init', this._initialize.bind(this));
    socket.on('send:message', this._messageReceive.bind(this));
    socket.on('send:private_message', this._messageReceive.bind(this));
    socket.on('user:join', this._userJoined.bind(this));
    socket.on('user:left', this._userLeft.bind(this));
    socket.on('idleusers', this._updateUsersStatus.bind(this));
    socket.on('image:display', this._displayUploadedImage);
    socket.on('change:name', this._userChangeName.bind(this));
  }

  _initialize(data) {
    const {users, user} = data;
    this.setState({users, user});
  }

  _messageReceive(message) {
    const {messages} = this.state;
    messages.push(message);
    this.setState(messages);
  }

  _displayUploadedImage(data) {
    const {messages} = this.state;
    let message = {
      user: data.user,
      body: data.image
    };
    messages.push(message);
    this.setState(messages);
  }

  _userJoined(data) {
    const {users, messages} = this.state;
    const {user} = data;
    users.push(user);
    messages.push({
      user: { name: SYSTEM },
      body:  user.name + ' Joined'
    });
    this.setState({users, messages});
  }

  _userLeft(data) {
    const {users, messages} = this.state;
    const {user} = data;
    for (let index = 0; index < users.length; index++) {
      if (users[index].name === user.name) {
        const removed = users.splice(index, 1);
      }
    }
    
    messages.push({
      user: { name: SYSTEM },
      body: user.name + ' Left'
    });
    this.setState({users, messages});
  }

  _userChangeName(data) {

  }
  
  handleMessageSubmit(message, toUser) {
    idleSecondsCounter = 0;
    const {messages} = this.state;
    messages.push(message);
    this.setState({messages});
    if (toUser === undefined) {
      if (message.body.indexOf("@") !== -1) {
        const stringArray = message.body.substring(1).split(":");
        const to = stringArray[0];
        const body = stringArray[1];
        this.state.users.forEach(user => {
          console.log(to);
          console.log(user.name);
          if (user.name === to) {
            socket.emit('send:private_message', {
              message, 
              toUser: user
            });
          }
        });
        
      } else {
        socket.emit('send:message', message);  
      }
      
    } else {
      socket.emit('send:private_message', {
        message, toUser
      });
      this.setState({
        reference: undefined
      })
    }
  }

  getAllMessages() {
    return `Welcome to chat room v${VERSION.toFixed(1)}, ` + this.state.user.name;
  }

  handleUsernameClick(user) {
    this.setState({
      reference: user
    });
  }

  updateMessageFormText() {
    // this.state.refer === i ?<CommunicationChat /> : <CommunicationChatBubbleOutline />
  }

  _updateUsersStatus(data) {
    const {users} = data;
    this.setState({users});
  }

  checkIdleTime() {
    idleSecondsCounter++;
    const {user} = this.state;
    if (idleSecondsCounter >= IDLE_TIMEOUT) {
      // window.clearInterval(idleSecondsTimer);
      counterUpdated = false;
      user.isIdled = true;
      socket.emit('user:idle', user);
    } else if (counterUpdated) {
      counterUpdated = false;
      user.isIdled = false;
      socket.emit('user:idle', user);
    }
    
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.leftContainer}>
          <MessageBoard 
            styleClass={styles.messageboard} 
            body={this.getAllMessages()}
            messages={this.state.messages} />
          <div className={styles.messageformContainer}>
            <MessageForm 
              styleClass={styles.messageform} 
              onMessageSubmit={this.handleMessageSubmit.bind(this)}
              user={this.state.user} 
              reference={this.state.reference}  /> 
            <ImageUploadForm
              socket={socket}
              user={this.state.user} />
          </div>
          <footer className={styles.helpDiv} >
            <p>{'This version supports emoji such as ":) :D d: :sunglasses:" and private messages.'}</p>
          </footer>
        </div>
        <div className={styles.rightContainer}>
          <UserList 
            users={this.state.users}
            onUsernameClick={this.handleUsernameClick.bind(this)} 
            updateMessageForm={this.state.reference}/>
        </div>
      </div>
    );
  }
}
