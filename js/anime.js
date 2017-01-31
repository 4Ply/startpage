String.prototype.replaceAll = function (search, replacement) {
    let target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function fetchWatchingAnime() {
    var host = "http://" + window.location.hostname;
    var stringUrl = host + ":7033/all_anime";
    $.ajax({
        type: "GET",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        url: stringUrl,
        dataType: "json",
        cache: true,
        success: function (response) {
            console.log("success : " + response.data);
            let watching_list = response.data;
            for (let anime of watching_list) {
                if (anime.status === '1') {
                    addWatchingAnime(anime.id, anime.title, anime.image_url, anime.reasons);
                } else if (anime.status === '6') {
                    addPlanToWatchAnime(anime.id, anime.title, anime.image_url, anime.reasons);
                }
            }
            document.body.setAttribute('class', 'load');
            addMouseHoverListeners();
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log("error : " + textStatus);
        }
    });
}

function createAnimeCard(id, title, img_url, reasons) {
    let watching_template = $($('#watching-template').html()).clone();

    $(watching_template).find("#anime-title").html(title);
    $(watching_template).find("#anime-img").attr('src', img_url);

    function possibly_link(reason) {
        if (reason.startsWith("http") || reason.startsWith("www")) {
            return '<a href="' + reason + '">' + reason + '</a>';
        }
        return reason;
    }

    for (let reason of reasons) {
        console.log(reason);
        $(watching_template).find("#reason-list tbody").append('<tr><td>' +
            possibly_link(reason) +
            '</td></tr>');
    }

    function getAddReasonText() {
        if (reasons.length == 0) {
            return "Add reason"
        } else {
            return "Add reason (Current: " + reasons.length + ")";
        }
    }

    $(watching_template).find("#add-reason").html(getAddReasonText());
    $(watching_template).find("#add-reason").attr('anime_id', id);
    $(watching_template).find("#mal-link").attr('href', 'https://myanimelist.net/anime/' + id);

    return watching_template;
}

function addMouseHoverListeners() {
    $('.card').hover(
        function () {
            $(this).find('> .card-image > img.activator').click();
        }, function () {
            $(this).find('> .card-reveal > .card-title').click();
        }
    );
}

function addWatchingAnime(id, title, img_url, reasons) {
    console.log("Adding watching card", title, img_url, reasons);
    let anime_card = createAnimeCard(id, title, img_url, reasons);
    $('#watching-container').append(anime_card);
    if (reasons.length > 0) {
        $('#watching-reasons-container').append(anime_card.clone());
    }
}

function addPlanToWatchAnime(id, title, img_url, reasons) {
    console.log("Adding plan to watch card", title, img_url, reasons);
    let anime_card = createAnimeCard(id, title, img_url, reasons);
    $('#plan-to-watch-container').append(anime_card);
    if (reasons.length > 0) {
        $('#plan-to-watch-reasons-container').append(anime_card.clone());
    }
}

function flushMALCache() {
    var host = "http://" + window.location.hostname;
    var stringUrl = host + ":7033/flush_cache";
    $.ajax({
        type: "GET",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        url: stringUrl,
        dataType: "json",
        cache: true,
        success: function (response) {
            console.log("flushMALCache success : " + response.data);
            window.location.reload();
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log("flushMALCache error : " + textStatus);
        }
    });
}

function handleKeyPress(key) {
    if (key === 'r') {
        flushMALCache();
        return true;
    }
    return false;
}

document.addEventListener('keydown', function (e) {
    console.log(e);
    if (handleKeyPress(e.key) === true) {
        e.preventDefault();
    }
});


fetchWatchingAnime();

$(document).ready(function () {
    let item = sessionStorage.getItem('show_anime_without_reasons');
    console.log("show_anime_without_reasons", item);
});
