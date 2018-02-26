$(function(){
  var loggedIn = false;
  var socket = io();

  //User has connected to the server
  //TODO jwplayer command to get the vid jwplayer("jw").getPlaylist()[0].file
  socket.on("connect", function(data){
    socket.emit("join", "hi from client");
  });

  //User has managed to log in
  socket.on("loginSuccess", function(data){
    data = (data == "true");
    if(data==true){
      $("#login").addClass("hidden");
      $("#logout").removeClass("hidden");
      $("#link").removeClass("hidden");
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
    return false;
  });

  //Logout signal recieved
  socket.on("logout",function(data){
    $("#login").removeClass("hidden");
    $("#logout").addClass("hidden");
    $("#link").addClass("hidden");
    loggedIn = false;
  });

  //User wants to send a link
  $("#linkForm").submit(function(){
//TODO multi lang
    var subBox1 = $("#subs1").val().split(",");
    var subBox2 = $("#subs2").val().split(",");
    var subBox3 = $("#subs3").val().split(",");
    var videoObj = {link:$("#linkBox").val(), subs:[]};
    if(subBox1 != "") videoObj.subs.push({link:subBox1[0], title:subBox1[2], lang:subBox1[1]});
    if(subBox2 != "") videoObj.subs.push({link:subBox2[0], title:subBox2[2], lang:subBox2[1]});
    if(subBox3 != "") videoObj.subs.push({link:subBox3[0], title:subBox3[2], lang:subBox3[1]});

    socket.emit("link", videoObj);
    return false;
  });

  //Video controls
  //TODO Youtube videos
  var video = $("video");
  var VideoPlayer = videojs("my-video");
  var currentVideo = {link:"anime.mp4", subs:[]};

  //Pause the video on command
  socket.on("pause", function(data){
    VideoPlayer.currentTime(data);
    VideoPlayer.pause();
    console.log("Video paused");
  });


  //Change the video
  socket.on("link", function(data){
    console.log("Updating media! " + data.link);

    if(currentVideo != data){
      VideoPlayer.dispose();

      var subs = "";
      if(data.subs.length > 0){
        for(var i in data.subs){
          subs = subs + "<track kind='captions' src='" + data.subs[i].link + "' srclang='" + data.subs[i].lang + "' label='" + data.subs[i].title + "' default />"
        }
      }

      var HTMLPlayer = "<video id=\"my-video\" class=\"video-js vjs-default-skin\" controls preload=\"auto\" width=\"1280\" height=\"720\" \> <source src=\"";
      HTMLPlayer = HTMLPlayer + data.link + "\" type=\"video/mp4\" />" + subs + "</video>";
      $("#videoContainer").append(HTMLPlayer);
      VideoPlayer = videojs("my-video",{"autoplay":false}, function(){
        console.log(subs);

        this.on("timeupdate", function(){
          if(loggedIn == true){
            console.log("Sending time");
            socket.emit("sync", this.currentTime());
          }else{
            console.log("Not logged in!");
          }
        });
        //TODO check if we need this
        this.on("pause", function(){
          console.log("Paused")
          if(loggedIn == true){
            console.log("Sending pause");
            socket.emit("pause", this.currentTime());
          }
        });
      });

    }
  });


  //Sync video
  socket.on("sync", function(data){
    console.log(data);
    if(Math.abs(data-VideoPlayer.currentTime())>5){
      VideoPlayer.currentTime(data);
    }
    if(VideoPlayer.paused()) VideoPlayer.play();
  });

  //Admin controls
    //TODO remove listener on logout
    VideoPlayer.on("timeupdate", function(){
      if(loggedIn == true){
        console.log("Sending time");
        socket.emit("sync", VideoPlayer.currentTime());
      }
    });

    VideoPlayer.on("pause", function(){
      console.log("Paused video");
      if(loggedIn == true){
        console.log("Sending pause");
        socket.emit("pause", VideoPlayer.currentTime());
      }
    })

});
