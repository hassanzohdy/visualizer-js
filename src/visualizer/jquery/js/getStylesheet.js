/**
 * Load stylesheet and return a promise object
 * 
 * @param {string} href 
 * @param callback position
 * @returns Promise
 */
$.getStylesheet = function (href, position) {
    return new Promise((resolve) => {
        var $link = $('<link/>', {
            rel: 'stylesheet',
            type: 'text/css',
            href: href,
            crossorigin: 'anonymous',
        }).on('load', () => {
            resolve($link);
        });

        if (position) {
            position($link);
        } else {
            $link.appendTo('head');
        }
    });
};