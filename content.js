// content.js

chrome.runtime.sendMessage({type: 'onload'}, (response) => {
    // do stuff with response (which will be the value of messageQueue
    // sent from background.js).
});
