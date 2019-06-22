const express = require('express');
const path = require('path');
const app = express();
let port = process.env.PORT ||3000;
//console.log(__dirname+'/../public');// /home/naruto/programming/node/node-chat-app/server/../public
// console.log(path.join(__dirname,'..','public'));// /home/naruto/programming/node/node-chat-app/public
const publicPath = path.join(__dirname,'..','public');
app.use(express.static(publicPath));

app.listen(port,()=>{
  console.log(`Server up on port ${port}`);
});
