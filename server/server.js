const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage,generateLocationMessage} = require("./utils/message.js");
const app = express();
let port = process.env.PORT ||3000;
//console.log(__dirname+'/../public');// /home/naruto/programming/node/node-chat-app/server/../public
// console.log(path.join(__dirname,'..','public'));// /home/naruto/programming/node/node-chat-app/public
const publicPath = path.join(__dirname,'..','public');
let server = http.createServer(app);
let io = socketIO(server);//we'll get web socket Server.
//io will be responsible for listening to server
io.on('connection',(socket)=>{

console.log("New user connected");//web sockets are persistent technology lient and server both keeps the channel open for as long as they both wanted.

socket.emit("newMessage",generateMessage("admin","Welcome to the Chat App"));

socket.broadcast.emit("newMessage",generateMessage("admin","New User Joined"));
socket.on("createLocationMessage",(coords)=>{
  io.emit('newLocationMessage',generateLocationMessage('admin',coords.latitude,coords.longitude));
});
socket.on("createMessage",(message,callback)=>{

  console.log("created Message",message);
  io.emit('newMessage',generateMessage(message.from,message.text));
  callback();//Sends Acknowledement
  // socket.broadcast.emit('newMessage',{
  //   from:message.from,
  //   text:message.text,
  //   createdAt:Date.now()
  // });

  })
  // socket.emit('newEmail',{
  //   from:"harshitsan@example.com",
  //   text:"hey what is going on",
  //   createdAt:123
  // });//similar to lister but instead we afre creating event
//event is still happeneing even if we dont send custom data

//
// socket.on("createEmail",(newEmail)=>{
//   console.log("Email created",newEmail);
// })
  socket.on("disconnect",()=>{
    console.log("User Was Disconnected");
  })
});//register event listener "built in event connection client connected to server lets you do something when the connection comes in"

//once the server is down network request is being made trying to reconnect with server



app.use(express.static(publicPath));

server.listen(port,()=>{
  console.log(`Server up on port ${port}`);
});
