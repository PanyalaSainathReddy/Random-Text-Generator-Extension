'use strict';

// Set up the Context Menu item "Paste BaconIpsum Text"
chrome.runtime.onInstalled.addListener(function(details) {
    chrome.contextMenus.create(
        {
            'title': 'Paste BaconIpsum Text',
            'id': 'pasteLorem',
            'contexts': ['editable']
        });
});