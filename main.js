var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);

var AuthedClient = null;
var CurrentVideo = {link:"anime.mp4", subs:[]};
var secretKey = "test123";

app.use(express.static("bower_components"));
app.use(express.static("static"));

io.on("connection", function(client){
  console.log("New client! Their ip is: "+ client.request.connection.remoteAddress);
   client.on("join", function(data){
     client.emit("link", CurrentVideo);
   });

   //Add the client to AuthedClient if he logs in
   client.on("login", function(data){
     if(data == secretKey){
       console.log("User logged in!");
       AuthedClient = client;
       client.emit("loginSuccess","true");
       client.broadcast.emit("logout", true);
     }else{
       console.log("User failed to log in :(")
       client.emit("loginSuccess","false");
     }
   });

   //Log the client out
   client.on("logout", function(data){
     client.emit("logout", false);
     AuthedClient = null;
   });

   //Sync the time
   client.on("sync",function(data){
     if(client == AuthedClient){
       var timeObj = data;
       client.broadcast.emit("sync", timeObj);
     }
   });

   //Sync pause
   client.on("pause", function(data){
     if(client == AuthedClient){
       client.broadcast.emit("pause", data);
     }
   });

   //Send the link to clients
   client.on("link",function(data){
     if(client == AuthedClient){
       CurrentVideo = data;
       io.emit("link", data);
     }
   });

});
server.listen(3001);
