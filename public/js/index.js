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
    $("#videlement").one("loadeddata", runAscii)
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
            }
        }
    })
}

function runAscii() {
    var ascii = new Jscii({
        el: document.getElementById("videlement"),
        width: 150,
        container: document.getElementById("asciiVid")
    })
    ascii.play();
    $("#videlement")[0].play();
    setTimeout(() => {
        $("#videlement")[0].pause();
        ascii.pause();
    }, 150)
    $("[name='Play']").click(function () {
        ascii.play();
    })
    $("[name='Pause']").click(function () {
        ascii.pause();
    })
}