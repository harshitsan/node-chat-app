const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

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

  socket.emit('newMessage',{
    from:"harshit",
    text:"Awesome howz you!!",
    createdAt:Date.now()
});
  socket.on("createMessage",(message)=>{
    message.createdAt = Date.now();//create at server so that client may not spoof it
    console.log("Message created :",message);
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
