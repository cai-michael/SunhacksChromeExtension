var checkloop;

$(document).ready(function () {
    axios.get("/check/" + vidid, {
        validateStatus: function (status) {
            return status < 500; // Reject only if the status code is greater than or equal to 500
        }
    }).then(function (res) {
        if (res.data.isValid) {
            if (res.data.downloaded) {
                $("#videlement").attr("src", "/vids/" + vidid + ".mp4");
                $("#videlement")[0].load();
                $("#videlement")[0].pause();
                setTimeout(runAscii, 500)
            } else {
                if (res.data.downloading) {
                    $("#downloadMessage").show();
                    //Show the user that the video is still downloading
                    checkloop = setInterval(checkDownload, 5000); //check every 5 seconds
                } else {
                    alert("Failed to start downloading");
                }
            }
        } else {
            alert("Invalid Video");
        }
    })
    $("[name='Play']").click(function () {
        $("#videlement")[0].play();
    })
    $("[name='Pause']").click(function () {
        $("#videlement")[0].pause();
    })
})

function checkDownload() {
    axios.get("/check/" + vidid, {
        validateStatus: function (status) {
            return status < 500; // Reject only if the status code is greater than or equal to 500
        }
    }).then(function (res) {
        if (res.data.isValid) {
            if (res.data.downloaded) {
                $("#videlement").attr("src", "/vids/" + vidid + ".mp4");
                $("#videlement")[0].load();
                $("#videlement")[0].pause();
                $("#downloadMessage").hide();
                clearInterval(checkloop);
                setTimeout(runAscii, 500)
            }
        }
    })
}

var results = [];
var count = 0;
var animationInterval = null;;

function getColor(cb) {
    $("#gettingColor").show();
    axios.get("/color/" + vidid).then(function (res) {
        results = res.data.frames;
        $("#asciiVid").html(results[0]);
        $("#gettingColor").hide();
        cb();
    });
}

function startAnimation() {
    if (animationInterval == null) animationInterval = setInterval(animate, 1000 / 3)
}

function stopAnimation() {
    if (animationInterval != null) {
        clearInterval(animationInterval);
        animationInterval = null;
    }
}

function animate() {
    $("#asciiVid").html(results[count]);
    count++;
    if(count >= results.length){
        clearInterval(animationInterval);
        animationInterval = null;
        count = 0;
    }
}

function runAscii() {
    getColor(function () {
        $("[name='Play']").click(function () {
            startAnimation();
        })
        $("[name='Pause']").click(function () {
            stopAnimation();
        })
    });
}