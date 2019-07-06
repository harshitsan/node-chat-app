const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage,generateLocationMessage} = require("./utils/message.js");
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');


let users = new Users();
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


socket.on("join",(params,callback)=>{
  if(isRealString(params.name)  &&  isRealString(params.room))
    {
      socket.join(params.room);
      users.removeUser(socket.id);
      users.addUser(socket.id,  params.name, params.room);
      io.to(params.room).emit('updateUsersList',users.getUserList(params.room));

      socket.emit("newMessage",generateMessage("Admin","Welcome to the Chat App"));
      socket.broadcast.to(params.room).emit("newMessage",generateMessage("Admin",`${params.name} Joined`));
      callback();
    }
    else
      return callback("name and room name required");
    });


socket.on("createLocationMessage",(coords)=>{
  let user = users.getUser(socket.id);
  io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name,coords.latitude,coords.longitude));
});
socket.on("createMessage",(message,callback)=>{

  // console.log("created Message",message);
  let user = users.getUser(socket.id);
  io.to(user.room).emit('newMessage',generateMessage(user.name,message.text));
  callback();//Sends Acknowledement
  // socket.broadcast.emit('newMessage',{
  //   from:message.from,
  //   text:message.text,
  //   createdAt:Date.now()
  // });

});

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
    let user = users.removeUser(socket.id);
    if(user)
    {
      io.to(user.room).emit('updateUsersList',users.getUserList(user.room));
      io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left`));

    }

    console.log("User Was Disconnected");

  })
});//register event listener "built in event connection client connected to server lets you do something when the connection comes in"

//once the server is down network request is being made trying to reconnect with server



app.use(express.static(publicPath));

server.listen(port,()=>{
  console.log(`Server up on port ${port}`);
});
