var ffmpeg = require("ffmpeg")
var path = require("path")
var fs = require("fs");
var imageToAscii = require("image-to-ascii");
var AU = require('ansi_up');
var ansi_up = new AU.default;
var rimraf = require("rimraf")

module.exports.toColor = function (id) {
  return new Promise(function (resolve, reject) {
    var p = path.join(__dirname, "videos", id + ".mp4")
    var process = new ffmpeg(p)
    var po = path.join(__dirname, "screenshots", id + "/");
    process.then(function (video) {
      video.fnExtractFrameToJPG(po, {
        frame_rate: 3,
        file_name: "image%s.jpg"
      }, async (err, files) => {
        var filesList = [];
        for(var i = 1; i <= files.length; i++){
          filesList.push(po + "image1280x720_" + i + ".jpg");
        }
        all = filesList.map(imToAscii);
        html = await Promise.all(all)
        rimraf(po, (err) => {
          if(err){
            console.error(err)
            return reject(err);
          }
          resolve(html);
        })
        /*
        process.then(function (video) {
      video.fnExtractFrameToJPG(po, {
        frame_rate: 5,
        file_name: "image%s.jpg"
      }, async (err, files) => {
        console.log(files)
        var results = [];
        as.eachSeries(files, async (file, cb) => {
          imToAscii(file).then((result) => {
            results.push(result);
            cb();
          });
        }, () => {
          resolve(results)
        });
      });
    })
    */
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
      if (err){
        console.log(JSON.stringify(err))
        return reject(err);
      }
      console.log("Done: %s", p)
      return resolve(ansi_up.ansi_to_html(converted));
    });
  });
}