String.prototype.replaceAll = function(search, replacement) {
    let target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function addAnime(suffix, customName, season) {
    var stringUrl = "http://localhost:7033/download_anime";
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

$("#urlSuffix").val(sessionStorage.getItem('anime'));
$("#customName").val(sessionStorage.getItem('anime').replaceAll("-", " "));

$("#submit-button").click(function () {
    addAnime($("#urlSuffix").val().trim(), $("#customName").val().trim(), $("#season").val().trim());
});

document.body.setAttribute('class', 'load');
