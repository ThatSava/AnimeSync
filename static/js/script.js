$(function(){
  var loggedIn = false;
  var socket = io();

  //User has connected to the server
  socket.on("connect", function(data){
    socket.emit("join", "hi from client");
  });

  //User has managed to log in
  socket.on("loginSuccess", function(data){
    data = (data == "true");
    if(data==true){
      $("#login").addClass("hidden");
      $("#logout").removeClass("hidden");
      loggedIn = true;
      console.log("true");
    }else{
      //TODO show error or smth
      console.log("false");
    }
  });

  //User wants to log in
  $("#loginForm").submit(function(){
    socket.emit("login", $("#pass").val());
    $("#pass").val("");
    return false;
  });

  //User wants to log out
  $("#logoutForm").submit(function(){
    socket.emit("logout", "true");
    $("#login").removeClass("hidden");
    $("#logout").addClass("hidden");
    loggedIn = false;
    return false;
  });

  //Video controls
  //TODO Youtube videos
  //TODO Subtitles
  var video = $("video");
  //Pause the video on command
  socket.on("pause", function(data){
    video.currentTime = data;
    video.pause();
    console.log("Video paused");
  });
  //Change the video
  socket.on("link", function(data){
    if(video.src != data){
      video.src = data;
      video.pause();
    }
  });
  //Sync video
  socket.on("sync", function(data){
    console.log(data);
    if(Math.abs(data-video.get(0).currentTime)>5){
      video.get(0).currentTime=data;
    }
    if(video.get(0).paused) video.get(0).play();
  });

  //Admin controls

    //TODO remove listener on logout
    //TODO only allow one admin to manage
    video.bind("timeupdate", function(){
      if(loggedIn == true){
        console.log("Sending time");
        socket.emit("sync", video.get(0).currentTime);
      }else{
        console.log("Not logged in!");
      }
    });

});
