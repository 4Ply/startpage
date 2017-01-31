String.prototype.replaceAll = function (search, replacement) {
    let target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function updateVolume(volume) {
    var host = "http://" + window.location.hostname;
    var stringUrl = host + ":7033/update_volume";
    $.ajax({
        type: "GET",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        url: stringUrl,
        data: {
            volume: volume
        },
        dataType: "json",
        cache: false,
        success: function (response) {
            // window.location = "../startpage";
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log("error : " + textStatus);
        }
    });
}

document.body.setAttribute('class', 'load');


$(function () {
    $("#slider").slider({
        min: 0,
        max: 100,
        orientation: "vertical",
        slide: function (event, ui) {
            let volume = "" + (ui.value * 65536) / 100;
            // if (volume.contains('.')) {
            volume = volume.split('.')[0];
            // }
            console.log(ui.value, volume);
            updateVolume(volume);
        }
    });
});


function getCurrentVolume() {
    var host = "http://" + window.location.hostname;
    var stringUrl = host + ":7033/current_volume";
    $.ajax({
        type: "GET",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        url: stringUrl,
        data: {},
        dataType: "json",
        cache: false,
        success: function (response) {
            console.log(response.data);
            let volume = (response.data / 65536) * 100;
            console.log(volume);
            $("#slider").slider("value", volume);

            setTimeout(function () {
                getCurrentVolume();
            }, 1000);
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log("error : " + textStatus);
        }
    });
}

setTimeout(function () {
    getCurrentVolume();
}, 1000);
