let hotlinks = new Map([
    ["https://www.reddit.com/", "reddit"],
    ["http://127.0.0.1:32400", "plex"],
    ["http://localhost:8989", "sonarr"],
    ["http://localhost:5050", "couchpotato"],
    ["https://www.deezer.com", "deezer"]
]);

var searchSites = [
    {
        "url": "https://www.youtube.com/results?search_query=",
        "alternateURL": "https://www.youtube.com/feed/subscriptions",
        "label": "Youtube",
        "hotkey": "y"
    },
    {
        "url": "https://encrypted.google.com/#safe=off&q=",
        "alternateURL": "https://encrypted.google.com",
        "label": "Google",
        "hotkey": "?"
    },
    {
        "url": "https://github.com/search?&q=",
        "alternateURL": "https://www.github.com",
        "label": "GitHub"
    },
    {
        "url": "http://extratorrent.cc/search/?search=",
        "label": "ExtraTorrent"
    },
    {
        "url": "https://aur.archlinux.org/packages/?O=0&K=",
        "label": "AUR",
        "hotkey": "a"
    },
    {
        "url": "http://kissanime.ru/Search/Anime/",
        "alternateURL": "http://kissanime.ru",
        "label": "KissAnime"
    },
    {
        "url": "https://thepiratebay.org/search/",
        "label": "The Pirate Bay",
        "hotkey": "p"
    },
    {
        "url": "http://euw.op.gg/summoner/userName=",
        "label": "OP.GG",
        "hotkey": "o"
    },
    {
        "url": "https://myanimelist.net/search/all?q=",
        "alternateURL": "https://myanimelist.net/animelist/Rainb0wCak3?status=1",
        "label": "My Anime List",
        "hotkey": "m"
    }
];

var statuses = [
    {
        "url": "http://127.0.0.1:8080",
        "label": "sabnzbd %",
        "endpoint": "sabnzbd"
    },
    {
        "url": "http://localhost:9091",
        "label": "%",
        "endpoint": "transmission"
    },
    {
        "url": "http://localhost/aria/webui-aria2",
        "label": "aria2 - %",
        "endpoint": "aria2"
    },
    {
        "url": "#",
        "label": "cmus \n%",
        "endpoint": "cmus"
    },
    {
        "url": "#",
        "label": "%",
        "endpoint": "anime_size"
    }
];

jQuery.fn.center = function () {
    this.css("position", "absolute");
    $(this).animate({top: "-30%", left: "34%"}, "fast");
    $(this).css("z-index", "10");
    return this;
};

var linkContainer = document.getElementById('container-links');
for (let [url, name] of hotlinks) {
    var link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('class', 'link');
    link.text = name;
    linkContainer.appendChild(link);
}

var searchContainer = document.getElementById('container-search');
for (var i in searchSites) {
    var searchSite = searchSites[i];
    var searchBox = document.createElement('input');
    searchBox.setAttribute('placeholder', searchSite["label"]);
    searchBox.id = i;
    searchBox.onblur = function () {
        this.value = "";
    };
    searchContainer.appendChild(searchBox);
}

var statusContainer = document.getElementById('container-status');
for (var i in statuses) {
    let status = statuses[i];
    var url = status["url"];
    var label = status["label"];
    var endpoint = status["endpoint"];

    var statusElement = document.createElement('a');
    statusElement.setAttribute('href', url);
    statusElement.setAttribute('class', 'link');
    statusElement.text = label;
    statusElement.id = endpoint;
    statusContainer.appendChild(statusElement);
    statusContainer.appendChild(document.createElement('br'));

    getStatus(endpoint, label);
}

function getStatus(endpoint, label) {
    var stringUrl = "http://localhost:7033/" + endpoint;
    $.ajax({
        type: "GET",
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        url: stringUrl,
        data: {},
        dataType: "json",
        cache: false,
        success: function (response) {
            document.getElementById(endpoint).innerHTML = label.replace("%", response.data);

            setTimeout(function () {
                getStatus(endpoint, label);
            }, 1000);
        },
        error: function (xhr, textStatus, errorThrown) {
            console.log("error : " + textStatus);
        }
    });
}

document.body.setAttribute('class', 'load');

var input = document.getElementsByTagName("input");
for (var i = 0; i < input.length; i++) {
    input[i].addEventListener('keydown', function (event) {
        if (event.key === "Enter") {
            if (this.value === "") {
                let alternateURL = searchSites[this.id]["alternateURL"];
                if (event.shiftKey === true && typeof alternateURL !== 'undefined') {
                    window.location = alternateURL;
                } else {
                    loseFocusOfCurrentElement();
                }
            } else {
                window.location = searchSites[this.id]["url"] + this.value;
            }
        }
    });
}

function handleKeyPress(key) {
    for (var i in searchSites) {
        var searchSite = searchSites[i];
        if (key === searchSite["hotkey"]) {
            document.getElementById(i).focus();
            return true;
        }
    }
    return false;
}

function loseFocusOfCurrentElement() {
    document.activeElement.blur();
    document.getElementsByTagName("body")[0].focus();
}

document.addEventListener('keyup', function (e) {
    refreshInputLabel();
});

function refreshInputLabel() {
    if (document.activeElement.tagName === "INPUT") {
        $("#header").text(document.activeElement.placeholder + ": " + document.activeElement.value);
    } else {
        $("#header").text("\\n");
    }
}

document.addEventListener('keydown', function (e) {
    console.log(e);
    if (document.activeElement.tagName === "BODY") {
        if (handleKeyPress(e.key) === true) {
            e.preventDefault();
            return;
        }
    }

    if (e.code === "Escape") {
        loseFocusOfCurrentElement();
    }
});

handleKeyPress('?');

function navigateToAddAnimePage(animeName) {
    sessionStorage.setItem('anime', animeName);
    window.location = 'add_anime.html';
}

function handlePaste(e) {
    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedData = clipboardData.getData('Text');

    if (pastedData.startsWith("http") === true || pastedData.startsWith("www") === true) {
        e.stopPropagation();
        e.preventDefault();

        let kissAnimeUrl = "http://kissanime.ru/Anime/";
        if (pastedData.startsWith(kissAnimeUrl)) {
            navigateToAddAnimePage(pastedData.substr(kissAnimeUrl.length));
        } else {
            window.location = pastedData;
        }
    }
}

document.addEventListener('paste', handlePaste);
