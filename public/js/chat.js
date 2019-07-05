let socket = io();//inititaling the req from client to server to open the web socket and keep that connection open.

//AutoScroll

function scrollToBottom(){
// console.log("hye");
  //selectors
  let messages = $("#chat-area");
  let newMessage = messages.children('li:last-child');

  //heights
  let clientHeight = messages.prop('clientHeight');
  let scrollTop = messages.prop('scrollTop');
  let scrollHeight = messages.prop('scrollHeight');
  let newMessageHeight = newMessage.innerHeight();
  let lastMessageHeight = newMessage.prev().innerHeight();

  if(clientHeight + scrollTop + newMessageHeight+ lastMessageHeight >=  scrollHeight)
    // console.log('Should scroll');
    {
      messages.scrollTop(scrollHeight);
    }
}



socket.on("connect",function(){//connection event also exists in client that will tell successfuly connected with server.
  //on method is exactly the same as on server.
  //console tab is like terminal in node.
  let params = jQuery.deparam(window.location.search);
  socket.emit('join',params,function(err){
    if(err){
      alert(err);
      window.location.href='/';
    } else{
      console.log("No Error");
    }

  });
  console.log("connected to server");
  })

  $("#chat-form").on("submit",function(event){
    event.preventDefault();
    let inputTextBox = $("[name=message]")//value in input field
    socket.emit('createMessage',{
      from:"User",
      text:inputTextBox.val()
    }, function(){
      inputTextBox.val("");//once the Acknowledement recieved by server
    });
  // console.log();
  })
socket.on("disconnect",function(){//connect event also exists in client that will tell disconnected with server.
  //on method is exactly the same.
console.log("disconnected to server");
})
socket.on('updateUsersList',function(users){
// console.log(e);
let ol = $('<ol></ol>');
users.forEach((user)=>{
  ol.append($('<li></li>').text(user));
})
$("#users").html(ol);

});

socket.on('newMessage',function(message){ //the calback function will reacive data sent by server emit function
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = $("#message-template").html();
  var html = Mustache.render(template,{
    from:message.from,
    text:message.text,
    time:formattedTime
  });
  $("#chat-area").append(html);
scrollToBottom();

  //$("#chat-area").append(`<li>${message.from} ${moment(message.createdAt).format('h:mm a')}:${message.text}</li>`);
});

socket.on('newLocationMessage',function(message){ //the calback function will reacive data sent by server emit function
  // console.log(message.url);
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = $("#location-message-template").html();
  var html = Mustache.render(template,{
    from:message.from,
    url:message.url,
    time:formattedTime
  });
  $("#chat-area").append(html);
  scrollToBottom();

//  $("#chat-area").append(`<li>${message.from}  ${moment(message.createdAt).format('h:mm a')}: <a target="_blank" href=${message.url}>My Current Url</a></li>`);
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
    locationButton.attr('disabled','disabled').text('Sending location...');
    navigator.geolocation.getCurrentPosition(function(position){
      locationButton.removeAttr('disabled').text('Send location');

      socket.emit('createLocationMessage',{
        latitude:position.coords.latitude,
        longitude:position.coords.longitude

      })
    },function(){
      alert('unable to fetch');
    })
});
