let hotlinks = new Map([
    ["https://www.reddit.com/", "reddit"],
    ["http://127.0.0.1:32400", "plex"],
    ["http://localhost:8989", "sonarr"],
    ["https://www.deezer.com", "deezer"]
]);

var searchSites = [
    {
        "url": "https://www.youtube.com/results?search_query=",
        "label": "Youtube",
        "hotkey": "y"
    },
    {
        "url": "https://encrypted.google.com/#safe=off&q=",
        "label": "Google",
        "hotkey": "?"
    },
    {
        "url": "https://github.com/search?&q=",
        "label": "GitHub"
    },
    {
        "url": "https://thepiratebay.se/search/",
        "label": "The Pirate Bay"
    },
    {
        "url": "https://aur.archlinux.org/packages/?O=0&K=",
        "label": "AUR",
        "hotkey": "a"
    },
    {
        "url": "https://wiki.archlinux.org/index.php?search=",
        "label": "ArchWiki"
    }
];

var statuses = [
    {
        "url": "http://localhost:9091",
        "label": "% torrents",
        "endpoint": "transmission"
    },
    {
        "url": "http://127.0.0.1:8080",
        "label": "sabnzbd %",
        "endpoint": "sabnzbd"
    }
];

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
            document.getElementById(endpoint).text = label.replace("%", response.data);
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
        if (event.keyCode == 13) {
            if (this.value === "") {
                loseFocusOfCurrentElement();
            } else {
                window.location = searchSites[this.id]["url"] + this.value;
            }
        }
    });
}

var isControlPressed = false;
document.addEventListener('keyup', function (e) {
    if (e.code === "Control") {
        isControlPressed = false;
    }
});

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
document.addEventListener('keydown', function (e) {
    console.log(e);
    if (document.activeElement.tagName === "BODY") {
        if (handleKeyPress(e.key) === true) {
            e.preventDefault();
        }
    }

    if (e.code === "Escape") {
        loseFocusOfCurrentElement();
    } else if (e.code === "Control") {
        isControlPressed = true;
    } else if (e.code === "v") {
        if (isControlPressed === true) {

        }
    }
});

handleKeyPress('?');

function handlePaste(e) {
    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedData = clipboardData.getData('Text');

    if (pastedData.startsWith("http") === true || pastedData.startsWith("www") === true) {
        e.stopPropagation();
        e.preventDefault();

        window.location = pastedData;
    }
}

document.addEventListener('paste', handlePaste);
