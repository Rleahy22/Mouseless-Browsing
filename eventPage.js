var updateTabs = function(tabId) {
    chrome.tabs.query({currentWindow: true}, function(tabs) {
        tabs.forEach(function(tab) {
            chrome.tabs.executeScript(tab.id, {file: "tabTitle.js"}, function() {
                chrome.tabs.sendMessage(tab.id, {tabId: tab.index}, function(response) {});
            });
        });
    });
};

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete') {
        chrome.tabs.query({currentWindow: true}, function(tabs) {
            tabs.forEach(function(tab) {
                chrome.tabs.executeScript(tab.id, {file: "tabTitle.js"}, function() {
                    chrome.tabs.sendMessage(tab.id, {tabId: tab.index, yo: "updated"}, function(response) {});
                });
            });
        });
    }
});

chrome.tabs.onMoved.addListener(function (tabId, moveInfo) {
    updateTabs(tabId);
});

chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
    updateTabs(tabId);
});

chrome.tabs.onAttached.addListener(function (tabId, attachInfo) {
    updateTabs(tabId);
});

chrome.tabs.onDetached.addListener(function (tabId, detachInfo) {
    updateTabs(tabId);
});

chrome.windows.onFocusChanged.addListener(function (windowId) {
    updateTabs(tabId);
});
