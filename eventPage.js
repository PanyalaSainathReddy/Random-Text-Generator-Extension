'use strict';

 var clipboardContent = "clipboardText";

 /**
 * Send the value that should be pasted to the content script.
 */

function sendPasteToContentScript() {
    // We first need to find the active tab and window and then send the data
    // along.

    chrome.windows.getCurrent(w => {
        chrome.tabs.query({active: true, windowId: w.id}, tabs => {
          const tabId = tabs[0].id;
          console.log(tabId);
          chrome.tabs.sendMessage(tabs[0].id, {data: clipboardContent});
        });
    });
}

async function getLoremText() {
    await chrome.storage.sync.get('loremText', function(data) {
        console.log(data.loremText);
        clipboardContent = data.loremText;
    });
}

/**
 * The function that will handle our context menu clicks.
 */
function onClickHandler(info, tab) {
    getLoremText();
    console.log(clipboardContent);
    setTimeout(() => {
        console.log(clipboardContent);
        if (info.menuItemId === 'pasteLorem') {
            console.log('clicked paste LoremIpsum');
            sendPasteToContentScript();
        }
    }, 1000);
}

// Register the click handler for our context menu.
chrome.contextMenus.onClicked.addListener(onClickHandler);

// Set up the Context Menu item "Paste BaconIpsum Text"
chrome.runtime.onInstalled.addListener(function(details) {
    chrome.contextMenus.create(
        {
            'title': 'Paste BaconIpsum Text',
            'id': 'pasteLorem',
            'contexts': ['editable']
        });
});