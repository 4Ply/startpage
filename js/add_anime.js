String.prototype.replaceAll = function(search, replacement) {
    let target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function addAnime(suffix, customName, season) {
    var host = "http://" + window.location.hostname;
    var stringUrl = host + ":7033/download_anime";
    $.ajax({
        type: "GET",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        url: stringUrl,
        data: {
            suffix: suffix,
            customName: customName,
            season: season
        },
        dataType: "json",
        cache: false,
        success: function (response) {
            window.location = "../startpage";
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log("error : " + textStatus);
        }
    });
}

function getParameterByName(name, url) {
    if (!url) {
          url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

let animeName = sessionStorage.getItem('anime');
if (animeName === null) {
	animeName = getParameterByName('anime');
}

$("#urlSuffix").val(animeName);
$("#customName").val(animeName.replaceAll("-", " "));

$("#submit-button").click(function () {
    addAnime($("#urlSuffix").val().trim(), $("#customName").val().trim(), $("#season").val().trim());
});

document.body.setAttribute('class', 'load');
