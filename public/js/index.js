let socket = io();//inititaling the req from client to server to open the web socket and keep that connection open.
socket.on("connect",function(){//connection event also exists in client that will tell successfuly connected with server.
  //on method is exactly the same as on server.
  //console tab is like terminal in node.
  // socket.emit('createEmail',{
  //   to:"aba@asbc.com",
  //   text:"hey i am awesome"
  // });

  socket.emit('createMessage',{
    to:"harshit",
    text:"hey buddy whatsupp"
  });

console.log("connected to server");
})
socket.on("disconnect",function(){//connect event also exists in client that will tell disconnected with server.
  //on method is exactly the same.
console.log("disconnected to server");
})

socket.on('newMessage',function(message){ //the calback function will reacive data sent by server emit function
  console.log("New Message",message);//print in web developer console
});

//creating custom event
// socket.on("newEmail",function(email){ //the calback function will reacive data sent by server emit function
//   console.log("new Email",email);//print in web developer console
// });
