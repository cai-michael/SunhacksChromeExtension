var validateYoutube = require("youtube-validate");
var ytdl = require("ytdl-core");
var path = require("path");
var fs = require("fs");

module.exports.isValidVideo = function(url){
  return new Promise(function(resolve, reject){
    validateYoutube.validateVideoID(url).then(resolve).catch(reject);
  });
}

module.exports.downloadVideo = function(url){
  return new Promise(function(resolve, reject){
    var p = path.join(__dirname, "videos", ytdl.getURLVideoID(url) + ".mp4")
    ytdl(url).pipe(fs.createWriteStream(p)).on('finish', resolve).on('error', reject);
  });
}