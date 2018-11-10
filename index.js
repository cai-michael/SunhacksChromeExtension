// Import the express module
var express = require("express");
// Path module, helps us to construct paths
var path = require("path");
// body-parser parses the form bodies so we can access them easily
var bodyParser = require("body-parser");
// Check if the url is valid
var isURL = require("is-url");
// Allows us to parse url and the query
var url = require("url");
var querystring = require("querystring");

var app = express();

// Parse the body of forms
app.use(bodyParser.urlencoded({ extended: false }))

app.get("/", function(req, res){
  var p = path.join(__dirname, "views", "home.html");
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
