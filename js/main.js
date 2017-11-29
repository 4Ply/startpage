let hotlinks = [
    ["admin", "http://localhost:8002", "kong"],
    ["admin", "http://$#:9000", "portainer"],
    ["admin", "http://192.168.2.1", "router"],
    ["admin", "http://192.168.4.4", "pfSense"],
    ["admin", "http://192.168.2.2", "switch"],
    ["admin", "http://192.168.2.1/DHCPTable.html", "dhcp table"],
    ["watch", "http://$#:32400/web", "plex"],
    ["watch", "https://www.twitch.tv/directory/game/League%20of%20Legends", "twitch"],
    ["sonarr", "http://$#:8991", "sonarr1"],
    ["sonarr", "http://$#:8992", "sonarr2"],
    ["sonarr", "http://$#:8993", "sonarr3"],
    ["download", "http://$#:5050", "couchpotato"],
    ["download", "http://localhost:8080", "sabnzbd"],
    ["read", "https://www.reddit.com", "reddit"],
    ["observe", "http://$#:19999", "netdata"],
    ["listen", "https://www.deezer.com", "deezer"],
    ["listen", "https://play.google.com/music", "play music"],
    ["listen", "https://soundcloud.com/seeking-blue", "soundcloud"],
    ["listen", "https://www.dubtrack.fm", "dubtrack"]
];

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
        "url": "https://thepiratebay.org/search/",
        "label": "The Pirate Bay",
        "hotkey": "p"
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
        "url": "http://lolnexus.com/EUW/search?name=",
        "alternateURL": "http://lolnexus.com/EUW/search?name=Queuing in Vayne",
        "label": "LoLNexus",
	"hotkey": "l"
    },
    {
        "url": "http://euw.op.gg/summoner/userName=",
        "label": "OP.GG",
        "alternateURL": "https://euw.op.gg/multi",
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
        "url": "https://clientzone.afrihost.com",
        "label": "Fibre Usage: %",
        "endpoint": "data_usage"
    },
    {
        "url": "http://localhost:9091",
        "label": "Node1: %",
        "endpoint": "transmission?port=9091&node=Node1"
    },
    {
        "url": "http://localhost:9092",
        "label": "Node2: %",
        "endpoint": "transmission?port=9092&node=Node2"
    },
    {
        "url": "http://localhost:9093",
        "label": "Node3: %",
        "endpoint": "transmission?port=9093&node=Node3"
    },
    {
        "url": "http://$#/aria/webui-aria2",
        "label": "aria2 - %",
        "endpoint": "aria2"
    },
    {
        "url": "#",
        "label": "cmus \n%",
        "endpoint": "cmus"
    },
    {
        "url": "anime.html",
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

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function showGroups() {
    var groupsContainer = document.getElementById('container-groups');
    $(groupsContainer).empty();
    let groupNames = hotlinks.map(function (currentValue) {
        return currentValue[0];
    }).filter(onlyUnique);

    for (let groupName of groupNames) {
        var group = document.createElement('a');
        group.setAttribute('href', "#");
        group.setAttribute('class', 'link group');
        group.text = groupName;
        group.onclick = function (event) {
            switchHotlinks(groupName);
            event.stopPropagation();
        };
        groupsContainer.appendChild(group);
    }
}

showGroups();
document.body.onclick = function () {
    showGroups();
}


function switchHotlinks(targetGroupName) {
    var linksContainer = document.getElementById('container-groups');
    $(linksContainer).empty();
    for (let [groupName, url, name] of hotlinks) {
        if (groupName === targetGroupName) {
            var link = document.createElement('a');
            link.setAttribute('href', url.replace('$#', window.location.hostname));
            link.setAttribute('class', 'link');
            link.text = name;
            linksContainer.appendChild(link);
        }
    }
    //$('#container-groups').addClass('lost_link');
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
    var url = status["url"].replace('$#', window.location.hostname);
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
    var host = window.location.protocol + "//" + window.location.hostname;
    if (window.location.hostname.indexOf('.') === -1) {
	    host += ":7033"
    } else {
	    host += "/startpage_api"
    }
    var stringUrl = host + "/" + endpoint;
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

//handleKeyPress('?');

function navigateToAddAnimePage(animeName) {
    sessionStorage.setItem('anime', animeName);
    window.location = './add_anime.html';
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
