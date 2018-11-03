if (typeof BASE_URL == 'undefined') {
    var BASE_URL = window.location.protocol + '://' + window.location.hostname + '/' + window.location.pathname;
}

/**
* Get the directory name of the given path
*
* @param string path
* @return string
*/
const dirname = path => path.substring(0, path.lastIndexOf("/") + 1);

/**
 * An alias method to console log
 */
const echo = console.log;

/**
 * Share global variable from any class internally
 * 
 * @param  string varName 
 * @param  mixed value
 * @returns void 
 */
const _global = (varName, value) => window[varName] = value;

/**
* Create a constant
*
* @param string constantName
* @param mixed value
* @return this
*/
const _const = (constantName, value) => {
    Object.defineProperty(window, constantName, {
        value: value,
        writable: false,
        enumerable: true,
        configurable: false,
    });
}

/**
* Generate full url for the given route
*
* @param string route
* @return string
*/
const url = route => {
    if (!route.startsWith('/' + Config.get('app.localeCode'))) {
        route = '/' + Config.get('app.localeCode') + route;
    }

    return typeof route != 'undefined' ? BASE_URL.rtrim('/') + route : window.location.href;
};

/**
* Generate full url for the path in assets dir
*
* @param string path
* @return string
*/
const assets = path => BASE_URL + '/public/' + path.ltrim('/');

/**
* Generate full url for the path in application assets in static folder
*
* @param string path
* @return string
*/
const appAssets = path => assets('static/' + Config.get('app.name') + '/' + path);

/**
* Void link to be placed in the href
*
*/
const voidLink = 'javascript:void(0)';

/**
 * Strip the given html from any tags
 * @param {string} html 
 * @returns string
 */
const _s = html => $('<span />').html(html).text();

/**
 * Convert|Encode any html tag to html entities
 * 
 * @param   string html
 * @returns string
 */
const _e = html => html.replace(/[&<>"']/g, function ($0) {
    return "&" + { "&": "amp", "<": "lt", ">": "gt", '"': "quot", "'": "#39" }[$0] + ";";
});

/**
* Get browser info
*
* @return object
*/
const browser = () => {
    var ua = navigator.userAgent, tem,
        M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return {
            name: 'IE',
            version: tem[1] || '',
        };
    }

    if (M[1] === 'Chrome') {
        tem = ua.match(/\bOPR|Edge\/(\d+)/);

        if (tem != null) {
            return {
                name: 'Opera',
                version: tem[1],
            };
        }
    }

    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];

    if ((tem = ua.match(/version\/(\d+)/i)) != null) {
        M.splice(1, 1, tem[1]);
    }

    return {
        name: M[0],
        version: M[1],
    };
};

/**
* Scroll to the top of the page with no smooth animation
*
*/
const scrollTop = () => document.body.scrollTop = document.documentElement.scrollTop = 0;