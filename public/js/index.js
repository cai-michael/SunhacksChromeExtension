var checkloop;

$(document).ready(function () {
    axios.get("/check/" + vidid).then(function (res) {
        if (res.data.isValid) {
            if (res.data.downloaded) {
                $("#videlement").attr("src", "/vids/" + vidid + ".mp4");
                $("#videlement")[0].load();
            } else {
                if (res.data.downloading) {
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
})

function checkDownload() {
    axios.get("/check/" + vidid).then(function (res) {
        if (res.data.isValid) {
            if (res.data.downloaded) {
                $("#videlement").attr("src", "/vids/" + vidid + ".mp4");
                $("#videlement")[0].load();
                clearInterval(checkloop);
            }
        }
    })
}