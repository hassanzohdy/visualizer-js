/**
 * Load stylesheet and return a promise object
 * 
 * @param {string} href 
 * @returns Promise
 */
$.getStylesheet = function (href, position) {
    var $deferred = $.Deferred();
    var $link = $('<link/>', {
        rel: 'stylesheet',
        type: 'text/css',
        href: href,
        crossorigin: 'anonymous',
    }).on('load', () => {
        $deferred.resolve($link);
    });

    if (position) {
        position($link);
    } else {
        $link.appendTo('head');
    }

    return $deferred;
};