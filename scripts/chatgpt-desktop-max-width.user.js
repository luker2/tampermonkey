// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2025-01-18
// @description  try to take over the world!
// @author       You
// @match        https://chatgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Convenience function to execute your callback only after an element matching readySelector has been added to the page.
    // Example: runWhenReady('.search-result', augmentSearchResults);
    // Gives up after 1 minute.
    function runWhenReady(readySelector, callback) {
        var numAttempts = 0;
        var tryNow = function() {
            var elem = document.querySelector(readySelector);
            if (elem) {
                callback(elem);
            } else {
                numAttempts++;
                if (numAttempts >= 34) {
                    console.warn(`ChatGPT-width: giving up after 34 attempts. Could not find: ${readySelector}`);
                } else {
                    setTimeout(tryNow, 250 * Math.pow(1.1, numAttempts));
                }
            }
        };
        tryNow();
    }

    function applyElementWidth() {
        // console.debug(`ChatGPT-width: ready to process after content loaded...`);
        function doWork() {
            const elements = document.querySelectorAll(chat_container_selector);
            // console.debug(`ChatGPT-width: have ${elements.length} elements to process...`);
            for (let i = 0; i < elements.length; i++) {
                // console.debug(`ChatGPT-width: processing element: ${elements[i]}`);
                elements[i].style.setProperty('max-width', '98%', 'important');
            }
        }
        doWork();
        const observer = new MutationObserver(function(mutations) {
            let eventRegistrationCount = 0;
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    eventRegistrationCount++;
                }
            });
            if(eventRegistrationCount > 0) {
                // console.debug('ChatGPT-width: mutation event, applying width adjustments...');
                doWork();
            }
        });
        // console.debug('ChatGPT-width: ready to observe mutations...');
        observer.observe(document.documentElement, { childList: true, subtree: true });

    };

    const chat_container_selector = '.text-base, .conversation-container';

    // dynamic page events
    runWhenReady(chat_container_selector, applyElementWidth, false);

})();