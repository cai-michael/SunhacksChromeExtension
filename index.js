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
// Allows us to check whether a youtube video exists
var videoValidator = require("./youtube")
// Allows us to see if we already have downloaded a video
var isDownloaded = require("file-exists")

var app = express();

// Parse the body of forms
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(express.static(path.join(__dirname, 'public')))
app.use("/vids", express.static(path.join(__dirname, 'videos')))
app.get("/", function (req, res) {
  var p = path.join(__dirname, "views", "home.html");
  res.sendFile(p)
});

app.get("/videos/:videoid", function(req, res) {
  res.end(req.params.videoid)
})

app.post("/video", function(req, res) {
  if (isURL(req.body.videoURL)) {
    var parsedURL = url.parse(req.body.videoURL)
    if (!parsedURL.host.includes("youtube.com")) { //if URL doesn't include youtube.com
      res.redirect("/");
    } else {
      if (parsedURL.query == undefined) { //if URL doesn't contain a query
        res.redirect("/");
      } else {
        var parsedQuery = querystring.parse(parsedURL.query);
        if (parsedQuery.v == undefined) { //if URL doesn't contain valid video URL
          res.redirect("/");
        } else {
          res.redirect("/videos/" + parsedQuery.v)
        }
      }
    }
  } else {
    res.redirect("/");
  }
});

var videosDownloading = [];

app.get("/check/:videoid", function(req, res) {
  //check to see if the video is a valid video
  (videoValidator.isValidVideo(req.params.videoid)).then(function() {
    //if the video is valid check to see if it is downloaded
    isDownloaded(path.join(__dirname, "videos", req.params.videoid + ".mp4")).then(function(downloaded) {
      //the video is downloaded already return object true
      if (downloaded) {
        res.json({
          isValid: true,
          downloaded: true
        })
      } else {
        //the video is not downloaded return object false
        res.json({
          isValid: true,
          downloaded: false,
          downloading: true
        })

        if(videosDownloading.indexOf(req.params.videoid) == -1){
          console.log("Downloading Video: %s", req.params.videoid)
          videosDownloading.push(req.params.videoid)
          videoValidator.downloadVideo("https://www.youtube.com/watch?v=" + req.params.videoid).then(function(){
            videosDownloading.splice(videosDownloading.indexOf(req.params.videoid), 1);
            console.log("Video Downoaded: %s", req.params.videoid)
          });
        }else{
          console.log("Already Downloading Video: %s", req.params.videoid)
        }
      }
    }).catch(function(){
      res.json({
        isValid: true,
        downloaded: false,
        downloading: false
      })
    })
  }).catch(function() {
    res.json({
      isValid: false
    })
  })
});

app.listen(8080, function(err) {
  if (err) throw err;
  console.log("Running!")
});
