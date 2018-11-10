var express = require("express");
var path = require("path");

var app = express();

app.get("/", function(req, res){
  var p = path.join(__dirname, "views", "home.html");
  console.log(p)
  res.sendFile(p)
});

app.get("/hello", function(req, res){
  res.end("Hello world!!!")
});

app.listen(8080, function(err){
  if(err) throw err;
  console.log("Running!")
});