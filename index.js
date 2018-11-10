var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var isURL = require("is-url");
var url = require("url");
var querystring = require("querystring");

var app = express();

app.use(bodyParser.urlencoded({ extended: false }))

app.get("/", function(req, res){
  var p = path.join(__dirname, "views", "home.html");
  console.log(p)
  res.sendFile(p)
});

app.get("/videos/:videoid", function(req, res){
  res.end(req.params.videoid)
})

app.get("/hello", function(req, res){
  res.end("Hello world!!!")
});

app.post("/video", function(req, res){
  if(isURL(req.body.videoURL)){
    var parsedURL = url.parse(req.body.videoURL)
    console.log(parsedURL.host);
    if(!parsedURL.host.includes("youtube.com")){
      res.redirect("/");
    }else{
      var parsedQuery = querystring.parse(parsedURL.query);
      res.redirect("/videos/" + parsedQuery.v)
    }
  }else{
    res.redirect("/");
  }
});

app.listen(8080, function(err){
  if(err) throw err;
  console.log("Running!")
});
