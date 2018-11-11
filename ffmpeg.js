var ffmpeg = require("ffmpeg")
var path = require("path")
var fs = require("fs");
var imageToAscii = require("image-to-ascii");
var AU = require('ansi_up');
var ansi_up = new AU.default;

module.exports.toColor = function (id) {
  return new Promise(function (resolve, reject) {
    var p = path.join(__dirname, "videos", id + ".mp4")
    var process = new ffmpeg(p)
    var po = path.join(__dirname, "screenshots", id + "/");
    process.then(function (video) {
      video.fnExtractFrameToJPG(po, {
        frame_rate: 2,
        file_name: "image%s.jpg"
      }, async (err, files) => {
        all = files.map(imToAscii);
        html = await Promise.all(all)
        resolve(html);
      });
    })
    /*ffmpeg(p).inputOptions(`-f image2 -bt 20M -vf fps=10 ${po}/images%03d.jpg`)
    fs.readdir(po, async (err, items) => {
      if (err) return reject(err);
      all = items.map(imToAscii);
      html = await Promise.all(all)
      resolve(html);
    });*/
    /*fs.mkdir(po, (err) => {
      if(err) return reject(err);
      ffmpeg(p).inputOptions(`-f image2 -bt 20M -vf fps=10 ${po}/images%03d.jpg`)
      fs.readdir(po, async (err, items) => {
        if(err) return reject(err);
        all = items.map(imToAscii);
        html = await Promise.all(all)
        resolve(html);
      });
    })*/
  });
}

function imToAscii(p) {
  return new Promise(function (resolve, reject) {
    console.log("Doing: %s", p)
    imageToAscii(p, {
      color: true,
      white_bg: false
    }, (err, converted) => {
      console.log("Converting: %s", p)
      if (err) return reject(err);
      console.log("Done: %s", p)
      return resolve(ansi_up.ansi_to_html(converted));
    });
  });
}