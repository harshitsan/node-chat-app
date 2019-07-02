let socket = io();//inititaling the req from client to server to open the web socket and keep that connection open.
socket.on("connect",function(){//connection event also exists in client that will tell successfuly connected with server.
  //on method is exactly the same as on server.
  //console tab is like terminal in node.


  $("#chat-form").on("submit",function(event){
    event.preventDefault();
    let inputValue = $("[name=message]").val();//value in input field

    socket.emit('createMessage',{
      from:"User",
      text:inputValue
    }, function(){
      console.log("message recieved, Acknowledement from server");
    });
  // console.log();
  })
console.log("connected to server");
})
socket.on("disconnect",function(){//connect event also exists in client that will tell disconnected with server.
  //on method is exactly the same.
console.log("disconnected to server");
})

socket.on('newMessage',function(message){ //the calback function will reacive data sent by server emit function
  $("#chat-area").append(`<li>From : ${message.from}, Message: ${message.text}</li>`);
});

socket.on('newLocationMessage',function(message){ //the calback function will reacive data sent by server emit function
  console.log(message.url);
  $("#chat-area").append(`<li>From : ${message.from}, <a target="_blank" href=${message.url}>My Current Url</a></li>`);
});

//creating custom event
// socket.on("newEmail",function(email){ //the calback function will reacive data sent by server emit function
//   console.log("new Email",email);//print in web developer console
// });

//geolocation
//The Geolocation API allows the user to provide their location to web applications if they so desire. For privacy reasons,
// the user is asked for permission to report location information.


let locationButton = $("#send-location");

locationButton.on("click",function(){
  if(!navigator.geolocation)
    return alert("geolocation not supported");
  else
    navigator.geolocation.getCurrentPosition(function(position){
      socket.emit('createLocationMessage',{
        latitude:position.coords.latitude,
        longitude:position.coords.longitude

      })
    },function(){
      alert('unable to fetch');
    })
});
