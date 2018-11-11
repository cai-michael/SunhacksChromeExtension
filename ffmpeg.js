var ffmpeg = require("fluent-ffmpeg")
var path = require("path")
var fs = require("fs");
var imageToAscii = require("image-to-ascii");

module.exports.toColor = function(id) {
  return new Promise(function(resolve, reject){
    var p = path.join(__dirname, "videos", id + ".mpg")
    var po = path.join(__dirname, "screenshots", id);
    fs.mkdir(po, (err) => {
      if(err) return reject(err);
      ffmpeg().inputOptions(`-i ${p} -f image2 -bt 20M -vf fps=10 ${po}/images%03d.jpg`)
      fs.readdir(po, (err, items) => {
        if(err) return reject(err);
        
      });
    })
  });
}

function imToAsci(p){
  return new Promise(function(resolve, reject){
    imageToAscii(p, {color: true, white_bg: false}, (err, converted) => {
      if(err) return reject(err);
      return resolve();
    });
  });
}