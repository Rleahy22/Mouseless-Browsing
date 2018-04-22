(function () {
    "use strict";

    let anchorTags = Array.prototype.slice.call(document.getElementsByTagName("a"));
    var iframes  = Array.prototype.slice.call(document.getElementsByTagName("iframe"));
    var inputs   = Array.prototype.slice.call(document.getElementsByTagName("input"));

    const appVersion    = navigator.appVersion;
    var attempts      = 0;
    var firstInput    = {};
    const keyCodes      = [49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 73, 80, 88];
    var keysPressed   = [];
    var last          = 0;
    var links         = [];
    var selectedLink  = {};
    var shown         = true;
    var specialKey    = 17;
    var tabs          = [];
    var tabbables     = [];
    var url           = document.URL;
    var videoElements = [];

    function clearTabbables () {
        tabbables.forEach((el) => {
            let tabElement = el.getElementsByClassName('exposed-tab');
            if (tabElement[0]) {
                tabElement[0].parentNode.removeChild(tabElement[0]);
            }
        });

        tabbables = tabs = [];
        chooseGetMethod();
    };

    function chooseGetMethod () {
        if (url === "www.google.com") {
            setTimeout(() => { googleGetElements(); }, 50);
        } else {
            getElements();
        }
    };

    function getElements () {
        anchorTags.forEach((tag, i) => {
            if (tag.tagName === 'A' && tag.href.length > 0 && tabbables.length < 9) {
                if (isVisible(tag)) {
                    exposeTabIndex(tag, i);
                }
            }
            if (tag.tagName === 'A' && tag.href.length > 0) {
                if (isVisible(tag)) {
                    links.push(tag);
                }
            }
        })

        anchorTags.splice(0, (last + 1));
    };

    function exposeTabIndex (element, index) {
        let newIndex = document.createElement("span");

        tabbables.push(element);

        newIndex.innerText = tabbables.length;
        newIndex.style.cssText = "display:inline-block;position:relative;top:-5px;right:0px;color:#708090;font-size:10px;";
        newIndex.className = "exposed-tab";

        if (element.children.length > 0 && url !== "www.google.com") {
            let children = Array.prototype.slice.call(element.children);

            children.some((child) => {
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

    function googleGetElements () {
        let results = Array.prototype.slice.call(document.getElementsByClassName('r'));
        let count = 0;

        if (results.length === 0 && attempts < 10) {
            attempts = attempts + 1;
            chooseGetMethod();
        }

        results.forEach((result) => {
            if (count > 8) {
                return;
            }

            count ++;

            let link = result.firstChild;

            exposeTabIndex(link, count);
        });
    };

    function isVisible (el) {
        return el.offsetParent !== null;
    };

    function toggleTabs () {
        if (shown) {
            shown = false;

            tabs.forEach((tab) => {
                tab.style.display = "none";
            });
        } else {
            shown = true;

            tabs.forEach((tab) => {
                tab.style.display = "inline-block";
            });
        }
    };

    function playVideo () {
        if (videoElements.length) {
            if (videoElements[0].src.indexOf("?") == -1) {
                videoElements[0].src = videoElements[0].src + "?autoplay=1";
            } else {
                videoElements[0].src = videoElements[0].src + "&autoplay=1";
            }
        }
    };

    function focusInput () {
        if (inputs.length) {
            firstInput.focus();
        }
    };

    function openInNewTab (url) {
        var win = window.open(url, '_blank');
        win.focus();
    };

    function getDomainFromUrl (url) {
        let urlDomain = url.substring(url.indexOf("://") + 3);
        urlDomain = urlDomain.substring(0, urlDomain.indexOf("/"));
        return urlDomain;
    };

    function openSearch () {
        let searchText = '';
        let upCount = 0;

        searchBox.style.cssText = "display:inline-block;";
        searchBox.focus();
        searchBox.addEventListener("keyup", (e) => {

            if (selectedLink.style) {
                selectedLink.style.background = '';
            }

            if (e.keyCode == 27) {
                searchBox.value = '';
                searchBox.style.cssText = "display:none;";
            } else if (e.keyCode == 13) {
                selectedLink.click();
            } else if (searchBox.value.length > 0) {
                searchLinks(new RegExp(searchBox.value, 'i'));
            }
        });
    };

    function searchLinks (query) {
        let matchedLinks = links.filter((link) => {
            return query.test(link.innerText)
        })

        if (matchedLinks.length) {
            matchedLinks[0].style.background = '#C8C8C8';
        }
    };

    url = getDomainFromUrl(url);

    if (appVersion.indexOf("Mac") != -1) {
        chooseGetMethod();
    }

    inputs = inputs.filter((input) => {
        return isVisible(input) && input.type !== 'button';
    })

    firstInput = inputs[0];

    iframes.forEach((iframe) => {
        let src = getDomainFromUrl(iframe.src);

        if (src === "www.youtube.com") {
            videoElements.push(iframe);
        }
    });

    const searchBox = document.createElement("input");
    searchBox.style.cssText = "display:none;position:fixed;top:0;left:0;height:20px;width:80px;background:#708090;font-size:10px;";
    searchBox.className = "extension-search";
    document.body.appendChild(searchBox);

    document.body.addEventListener('keydown', (e) => {
        if (e.keyCode == specialKey && (appVersion.indexOf("Linux") != -1 || appVersion.indexOf("Win") != -1)) {
            e.preventDefault();
            e.altKey = false;
        }
        if ((e.keyCode == specialKey || e.keyCode == 16 || keysPressed[0] === specialKey || keysPressed[0] == 16 || keysPressed[1] === specialKey || keysPressed[1] == 16) && keysPressed.length < 3) {
            keysPressed.push(e.keyCode);
        }
    });

    document.body.addEventListener('keyup', (e) => {
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
        keysPressed = [];
    });
})();
