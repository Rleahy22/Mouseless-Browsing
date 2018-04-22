function updateTabs (tabId) {
    chrome.tabs.query({currentWindow: true}, (tabs) => {
        tabs.forEach((tab) => {
            chrome.tabs.executeScript(tab.id, {file: "tabTitle.js"}, function () {
                chrome.tabs.sendMessage(tab.id, {tabId: tab.index}, function (response) {});
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

chrome.tabs.onMoved.addListener((tabId, moveInfo) => {
    updateTabs(tabId);
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
    updateTabs(tabId);
});

chrome.tabs.onAttached.addListener((tabId, attachInfo) => {
    updateTabs(tabId);
});

chrome.tabs.onDetached.addListener((tabId, detachInfo) => {
    updateTabs(tabId);
});

chrome.windows.onFocusChanged.addListener((windowId) => {
    updateTabs(tabId);
});
