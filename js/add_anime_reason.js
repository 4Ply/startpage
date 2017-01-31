function addReasonForAnime(anime_id, reason) {
    var host = "http://" + window.location.hostname;
    var stringUrl = host + ":7033/add_anime_reason";
    $.ajax({
        type: "GET",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        url: stringUrl,
        data: {
            anime_id: anime_id,
            reason: reason
        },
        dataType: "json",
        cache: true,
        success: function (response) {
            console.log("success : " + response.data);
            window.location.reload();
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log("error : " + textStatus);
        }
    });
}

function addReason(anime_id) {
    const reason = prompt("Enter a reason to watch this Anime:");

    if (reason !== null) {
        addReasonForAnime(anime_id, reason);
    }
}
