var express = require("express");
var app = express();

app.get("/", function(req, res){
  res.end("Hello world!")
});

app.get("/hello", function(req, res){
  res.end("Hello world!!!")
});

app.listen(8080, function(err){
  if(err) throw err;
});