var elements = document.getElementsByTagName("*");
var iframes = document.getElementsByTagName("iframe");
var inputs = document.getElementsByTagName("input");
var firstInput = {};
var videoElements = [];
var tabbables = [];
var keysPressed = [];
var keyCodes = [49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 73, 80, 88];
var last = 0;
var url = document.URL;
var attempts = 0;
var shown = true;
var tabs = [];
var specialKey = 17;
var appVersion = navigator.appVersion;

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


document.body.addEventListener('keydown', function(e) {
    "use strict";
    if (e.keyCode == specialKey && (appVersion.indexOf("Linux") != -1 || appVersion.indexOf("Win") != -1)) {
        e.preventDefault();
        e.altKey = false;
    }
    if ((e.keyCode == specialKey || e.keyCode == 16 || keysPressed[0] === specialKey || keysPressed[0] == 16 || keysPressed[1] === specialKey || keysPressed[1] == 16) && keysPressed.length < 3) {
        keysPressed.push(e.keyCode);
    }
});

document.body.addEventListener('keyup', function(e) {
    "use strict";
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

function clearTabbables() {
    "use strict";
    tabbables.forEach(function(el) {
        var tabElement = el.getElementsByClassName('exposed-tab');
        tabElement[0].parentNode.removeChild(tabElement[0]);
    });
    emptyArray(tabbables);
    emptyArray(tabs);
    chooseGetMethod();
}

function chooseGetMethod() {
    "use strict";
    if (url === "www.google.com") {
        setTimeout(function() { googleGetElements(); }, 200);
    } else {
        getElements();
    }
}

function getElements() {
    "use strict";
    for (var i=0; i < elements.length; i++) {
        if (elements[i].tagName === 'A' && elements[i].href.length > 0 && tabbables.length < 9) {
            if (isVisible(elements[i])) {
                exposeTabIndex(elements[i], i);
            }
        }
    }
    elements.splice(0, (last + 1));
}

function exposeTabIndex(element, index) {
    "use strict";
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
}

function googleGetElements() {
    "use strict";
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
}

function isVisible(el) {
    "use strict";
    if (el.offsetParent === null) {
        return false;
    } else {
        return true;
    }
}

function toggleTabs() {
    "use strict";
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
}

function playVideo() {
    "use strict";
    if (videoElements.length) {
        if (videoElements[0].src.indexOf("?") == -1) {
            videoElements[0].src = videoElements[0].src + "?autoplay=1";
        } else {
            videoElements[0].src = videoElements[0].src + "&autoplay=1";
        }
    }
}

function focusInput() {
    "use strict";
    if (inputs.length) {
        firstInput.focus();
    }
}

function openInNewTab(url) {
    "use strict";
    var win = window.open(url, '_blank');
    win.focus();
}

function getDomainFromUrl(url) {
    "use strict";
    url = url.substring(url.indexOf("://") + 3);
    url = url.substring(0, url.indexOf("/"));
    return url;
}

function emptyArray(array) {
    "use strict";
    while(array.length > 0) {
        array.pop();
    }
}