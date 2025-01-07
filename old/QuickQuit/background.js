chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {
    if (request && request.message === "version") {
        sendResponse({ version: 1.0 });
    }
});
