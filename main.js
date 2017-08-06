var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);

var AuthedClients = [];
var secretKey = "test123";

app.use(express.static("bower_components"));
app.use(express.static("static"));

io.on("connection", function(client){
  console.log("New client!");
  //TODO send the video to the new client on connect

   client.on("join", function(data){
     console.log(data);
   });

   //Add the client to AuthedClients if he logs in
   //TODO check if the client limit is reached
   //TODO only allow one user to log in instead
   client.on("login", function(data){
     if(data == secretKey){
       console.log("User logged in!");
       AuthedClients.push(client);
       client.emit("loginSuccess","true");
     }else{
       console.log("User failed to log in :(")
       client.emit("loginSuccess","false");
     }
   });

   //Log the client out
   client.on("logout", function(data){
     var index = AuthedClients.indexOf(client);
     if(index > -1){
       AuthedClients.splice(index, 1);
     }
     console.log("User logged out");
   });

   client.on("sync",function(data){
     client.broadcast.emit("sync", data);
   });

});
server.listen(3000);
