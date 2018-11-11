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
                $("#downloadMessage").hide();
                clearInterval(checkloop);
            }
        }
    })
}