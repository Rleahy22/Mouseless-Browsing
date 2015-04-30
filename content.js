"use strict";

var elements = document.getElementsByTagName("*");
var iframes = document.getElementsByTagName("iframe");
var inputs = document.getElementsByTagName("input");
var firstInput = {};
var videoElements = [];
var tabbables = [];
var links = [];
var keysPressed = [];
var keyCodes = [49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 73, 80, 88];
var last = 0;
var url = document.URL;
var attempts = 0;
var shown = true;
var tabs = [];
var specialKey = 17;
var appVersion = navigator.appVersion;
var selectedLink = {};


var clearTabbables = function() {
    tabbables.forEach(function(el) {
        var tabElement = el.getElementsByClassName('exposed-tab');
        tabElement[0].parentNode.removeChild(tabElement[0]);
    });
    emptyArray(tabbables);
    emptyArray(tabs);
    chooseGetMethod();
};

var chooseGetMethod = function() {
    if (url === "www.google.com") {
        setTimeout(function() { googleGetElements(); }, 200);
    } else {
        getElements();
    }
};

var getElements = function() {
    for (var i=0; i < elements.length; i++) {
        if (elements[i].tagName === 'A' && elements[i].href.length > 0 && tabbables.length < 9) {
            if (isVisible(elements[i])) {
                exposeTabIndex(elements[i], i);
            }
        }
        if (elements[i].tagName === 'A' && elements[i].href.length > 0) {
            if (isVisible(elements[i])) {
                links.push(elements[i]);
            }
        }
    }
    elements.splice(0, (last + 1));
};

var exposeTabIndex = function(element, index) {
    tabbables.push(element);
    var newIndex = document.createElement("span");
    newIndex.innerText = tabbables.length;
    newIndex.style.cssText = "display:inline-block;position:relative;top:-5px;right:0px;color:#708090;font-size:10px;";
    newIndex.className = "exposed-tab";
    if (element.children.length > 0 && url !== "www.google.com") {
        var children = Array.prototype.slice.call(element.children);
        children.some(function(child) {
            if (child.innerText.length > 0) {
                child.appendChild(newIndex);
                return true;
            }
        });
    } else {
        element.appendChild(newIndex);
    }
    tabs.push(newIndex);
    last = index;
};

var googleGetElements = function() {
    var results = document.getElementsByClassName('r');
    var count = 0;
    results = Array.prototype.slice.call(results);
    if (results.length === 0 && attempts < 10) {
        attempts = attempts + 1;
        chooseGetMethod();
    }
    results.forEach(function(result) {
        if (count > 8) {
            return;
        }
        count = count + 1;
        var link = result.firstChild;
        exposeTabIndex(link, count);
    });
};

var isVisible = function(el) {
    if (el.offsetParent === null) {
        return false;
    } else {
        return true;
    }
};

var toggleTabs = function() {
    if (shown) {
        shown = false;
        tabs.forEach(function(tab) {
            tab.style.display = "none";
        });
    } else {
        shown = true;
        tabs.forEach(function(tab) {
            tab.style.display = "inline-block";
        });
    }
};

var playVideo = function() {
    if (videoElements.length) {
        if (videoElements[0].src.indexOf("?") == -1) {
            videoElements[0].src = videoElements[0].src + "?autoplay=1";
        } else {
            videoElements[0].src = videoElements[0].src + "&autoplay=1";
        }
    }
};

var focusInput = function() {
    if (inputs.length) {
        firstInput.focus();
    }
};

var openInNewTab = function(url) {
    var win = window.open(url, '_blank');
    win.focus();
};

var getDomainFromUrl = function(url) {
    url = url.substring(url.indexOf("://") + 3);
    url = url.substring(0, url.indexOf("/"));
    return url;
};

var emptyArray = function(array) {
    while(array.length > 0) {
        array.pop();
    }
};

var openSearch = function() {
    var searchText = '';
    var upCount = 0;
    searchBox.style.cssText = "display:inline-block;position:fixed;top:0;left:0;height:20px;width:80px;background:#708090;font-size:12px;color:#FFFFFF";
    searchBox.focus();
    searchBox.addEventListener("keyup", function(e) {
        if (selectedLink.style) {
            selectedLink.style.background = '';
        }
        if (e.keyCode == 27) {
            searchBox.value = '';
            searchBox.style.cssText = "display:none;position:fixed;top:0;left:0;height:20px;width:80px;background:#708090;font-size:10px;";
        } else if (e.keyCode == 13) {
            selectedLink.click();
        } else if (searchBox.value.length > 0) {
            searchLinks(searchBox.value.toUpperCase());
        }
    });
};

var searchLinks = function(query) {
    var queryLength = query.length;
    for (var i = 0; i < links.length; i++) {
        if (links[i].innerText.substring(0, queryLength).toUpperCase() === query) {
            selectedLink = links[i];
            break;
        }
    }
    selectedLink.style.background = '#C8C8C8';
};

elements = Array.prototype.slice.call(elements);
iframes = Array.prototype.slice.call(iframes);
inputs = Array.prototype.slice.call(inputs);

url = getDomainFromUrl(url);

if (appVersion.indexOf("Mac") != -1) {
    chooseGetMethod();
}

for (var i = 0; i < inputs.length; i++) {
    if (!isVisible(inputs[i])) {
        inputs.splice(i, 1);
        i = i - 1;
    } else if (inputs[i].type === "button") {
        inputs.splice(i, 1);
        i = i - 1;
    }
}

firstInput = inputs[0];

iframes.forEach(function(iframe) {
    var src = iframe.src;
    src = getDomainFromUrl(src);
    if (src === "www.youtube.com") {
        videoElements.push(iframe);
    }
});

var searchBox = document.createElement("input");
searchBox.style.cssText = "display:none;position:fixed;top:0;left:0;height:20px;width:80px;background:#708090;font-size:10px;";
searchBox.className = "extension-search";
document.body.appendChild(searchBox);

document.body.addEventListener('keydown', function(e) {
    if (e.keyCode == specialKey && (appVersion.indexOf("Linux") != -1 || appVersion.indexOf("Win") != -1)) {
        e.preventDefault();
        e.altKey = false;
    }
    if ((e.keyCode == specialKey || e.keyCode == 16 || keysPressed[0] === specialKey || keysPressed[0] == 16 || keysPressed[1] === specialKey || keysPressed[1] == 16) && keysPressed.length < 3) {
        keysPressed.push(e.keyCode);
    }
});

document.body.addEventListener('keyup', function(e) {
    var tabUrl;
    if (e.keyCode == specialKey && keysPressed.length == 2) {
        keysPressed.splice(keysPressed.indexOf(specialKey), 1);
        if (keysPressed[0] == 48) {
            clearTabbables();
        } else if (keysPressed[0] == 88) {
            toggleTabs();
        } else if (keysPressed[0] == 80) {
            playVideo();
        } else if (keysPressed[0] == 73) {
            focusInput();
        } else if (keysPressed[0] == 83) {
            openSearch();
        } else {
            tabbables[keyCodes.indexOf(keysPressed[0])].click();
        }
    } else if ((e.keyCode == specialKey || e.keyCode == 16) && keysPressed.length == 3) {
        keysPressed.splice(keysPressed.indexOf(specialKey), 1);
        if (tabbables[keyCodes.indexOf(keysPressed[0])] === undefined) {
            tabUrl = tabbables[keyCodes.indexOf(keysPressed[1])].href;
        } else {
            tabUrl = tabbables[keyCodes.indexOf(keysPressed[0])].href;
        }
        openInNewTab(tabUrl);
    } else if (keyCodes.indexOf(e.keyCode) != -1 && keysPressed.indexOf(e.keyCode) != -1 && keysPressed.length == 2  && keysPressed.indexOf(specialKey) != -1) {
        if (e.keyCode == 48) {
            clearTabbables();
        } else if (e.keyCode == 88) {
            toggleTabs();
        } else if (e.keyCode == 80) {
            playVideo();
        } else if (e.keyCode == 73) {
            focusInput();
        } else {
            tabbables[keyCodes.indexOf(e.keyCode)].click();
        }
    } else if (keyCodes.indexOf(e.keyCode) != -1 && keysPressed.indexOf(e.keyCode) != -1 && keysPressed.length == 3) {
        tabUrl = tabbables[keyCodes.indexOf(e.keyCode)].href;
        openInNewTab(tabUrl);
    }
    emptyArray(keysPressed);
});