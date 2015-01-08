chrome.extension.onMessage.addListener(function(msg, _, sendResponse) {
    if (msg.tabId < 8) {
        if (isNaN(document.title.substring(0,1))) {
            document.title = (msg.tabId + 1) + " " + document.title + '*';
        } else {
            if (document.title.substring((document.title.length - 1), document.title.length) === '*') {
                document.title = (msg.tabId + 1) + " " + document.title.substring(2, document.title.length);
            } else {
                document.title = (msg.tabId + 1) + " " + document.title + '*';
            }
        }
    } else if (!(isNaN(document.title.substring(0,1)))) {
        if (document.title.substring((document.title.length - 1), document.title.length) === '*') {
            document.title = document.title.substring(2);
        }
    }
});