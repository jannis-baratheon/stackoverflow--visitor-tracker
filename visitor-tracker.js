(function() {
    "use strict";

    console.log('Initializing Visitor Tracker...');
    console.log('Initializing event watchers...');
    initWatchers();
    console.log('Initializing DOM watcher...');
    initDocumentWatcher();
    console.log('Initializing Visitor Tracker done.');

    function initDocumentWatcher() {
        var handleDOMChanged = function() {
            handleEvent({type: 'HTML_CHANGE', html: document.documentElement.outerHTML });
        };

        document.addEventListener('DOMContentLoaded', function(){
            handleDOMChanged();

            new MutationObserver(handleDOMChanged).observe(document, {
                attributes: true,
                childList: true,
                subtree: true,
                characterData: true
            });
        });
    }

    function initWatchers() {
        // watch viewport size change
        watch(window, 'resize', function() {
            var w = window,
                d = document,
                e = d.documentElement;

            return { type: 'VIEWPORT_SIZE', x: e.clientWidth, y: e.clientHeight };
        }, true);

        // watch scroll state
        watch(window, 'scroll', function() {
            return { type: 'SCROLL_STATE', x: window.scrollX, y: window.scrollY };
        });

        // watch mouse clicks
        watch(document, 'click', function(event) {
            return { type: 'MOUSE_CLICK', x: event.clientX, y: event.clientY };
        });

        // watch mouse move
        watch(document, 'mousemove', function(event) {
            return { type: 'MOUSE_MOVE', x: event.clientX, y: event.clientY };
        });
    }

    function watch(target, eventName, transformEventCb, callCbOnInit) {
        if (callCbOnInit) {
            handleEvent(transformEventCb(null));
        }

        target.addEventListener(eventName, function(event) {
            handleEvent(transformEventCb(event));
        }, true);
    }

    function handleEvent(event) {
        event.ts = new Date().getTime();
        console.log(event);
    }
})();