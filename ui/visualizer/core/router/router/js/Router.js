class Router {
    /**
    * Constructor
    *
    */
    constructor(layout, events) {
        this.layout = layout;
        this.events = events;
        this.previousRoute = '/';
        this.currentRoute = '/';

        this._buildCurrentRoute();

        this.stack = [];

        this.index = 0;

        this._handleHistoryLinks();

        this._handleLinks();

        // this event is triggered when user clicks on an anchor tag
        // or the url is changed manually by the developer using the navigateTo method 
        this.events.on('router.navigating', route => {
            this.previousRoute = this.route();
        });
    }

    /**
     * Get current hash
     * 
     * @returns string
     */
    hash() {
        // get the hash value without the # symbol
        return window.location.hash.substring(1);
    }

    /**
    * Get current route
    *
    * @param bool withQueryString
    * @return string
    */
    route(withQueryString = Router.WITHOUT_QUERY_STRING) {
        return withQueryString == Router.WITH_QUERY_STRING ?
            this.currentRoute :
            this.currentRoute.split('?')[0];
    }

    /**
     * Navigate to the given route in url
     * 
     * @param string route
     * @return void
     */
    navigateTo(route) {
        return this.navigateToUrl(url(route));
    }

    /**
     * Navigate to the given url
     * 
     * @param string fullUrl
     */
    navigateToUrl(fullUrl) {
        this._setUrl(fullUrl);

        this.scan();
    }

    /**
     * Navigate back
     * 
     * @returns void
     */
    navigateBack() {
        this.navigateTo(this.previousRoute || '/');
    }

    /**
    * Get current url
    *
    * @param   bool withQueryString
    * @returns string
    */
    url(withQueryString = Router.WITHOUT_QUERY_STRING) {
        let currentUrl = window.location.href;

        return withQueryString ? currentUrl : currentUrl.split('?')[0];
    }

    /**
    * Reload current page
    *
    */
    refresh() {
        this.navigateTo(this.route(Router.WITH_QUERY_STRING));
    }

    /**
     * Get previous route
     */
    prev() {
        return this.previousRoute;
    }

    /**
     * Reload the previous page
     */
    goBack() {
        this._setUrl(url(this.prev()));

        window.location.reload();
    }

    /**
     * Get query string object
     * 
     * @returns QueryString
     */
    get queryString() {
        return new QueryString;
    }

    /**
     * Start scanning the routes list for to match the current route
    *
    */
    scan() {
        let currentRoute = this.route();

        this.events.trigger('router.navigating', currentRoute);

        for (let routePath in Router.list) {
            let route = Router.list[routePath],
                matches = currentRoute.match(route.pattern);

            if (matches) {
                delete matches[0];

                let params = matches.reset();

                let paramValues = {};
                if (!Is.empty(route.paramsList)) {
                    for (let i = 0; i < params.length; i++) {
                        paramValues[route.paramsList[i]] = params[i];
                    }
                } else {
                    paramValues = matches;
                }

                // now we will check if there is an object of the page component
                if (!route.pageObject) {
                    route.pageObject = this.layout.newPage(route);
                }

                route.pageObject.route = routePath;

                route.params = paramValues;

                this.current = route;

                // store all parameters in the params property
                this.params = route.params;

                if (this.events.trigger('router.navigation', currentRoute) === false) return;

                route.pageObject.run(params);

                break;
            }
        }
    }

    /**
     * Build current route and cache it in a property
     */
    _buildCurrentRoute() {
        let currentUrl = this.url();

        let route = '/' + currentUrl.removeFirst((SCRIPT_URL || BASE_URL).rtrim('/') + '/');

        // remove the locale from the url
        let regex = new RegExp(`^\/${Config.get('app.localeCode')}`);
        route = route.replace(regex, '/').replace(/\/+/, '/');

        // decode the url if it has any uft8 encoding
        route = decodeURIComponent(route);

        if (route != '/') {
            route = route.rtrim('/');
        }

        // remove the hash from the route
        this.currentRoute = route.split('#')[0];
    }

    /**
    * Handle all links
    *
    */
    _handleLinks() {
        let $this = this;

        $(document).on('click', 'a', function (e) {
            let btn = $(this),
                url = btn.attr('href');

            // if user clicks ctrl with the mouse click
            // then we will allow him to open the url in new window
            if (!url || e.ctrlKey || btn.attr('target') == '_blank') {
                if (url && url.startsWith('/')) {
                    this.href = url(url);
                }

                return;
            }

            if (url.startsWith('#') || btn.hasClass('normal-link')) {
                return;
            }

            if (url.startsWith('/')) {
                e.preventDefault();
                $this.navigateTo(url);
            } else if (url.startsWith('javascript')) {
                return false;
            } else if (url.startsWith(url(''))) {
                e.preventDefault();
                $this.navigateToUrl(url);
            } else {
                window.open(url, '_blank');
                return false;
            }
        }).on('contextmenu mousedown', 'a', function (e) {
            // generate full absolute link to the relative links
            // as the user may open it in new tab or copy the url location
            // mousedown event for the middle mouse button click

            if (e.type == 'mousedown' && e.which != 2) return true;

            let btn = $(this),
                href = btn.attr('href');

            if (href.startsWith('/')) {
                btn.attr('href', url(href));

                // reset it back again to original uri
                setTimeout(() => {
                    btn.attr('href', href);
                }, 10);
            }
        });
    }

    /**
    * Start handling history links
    *
    */
    _handleHistoryLinks() {
        window.onpopstate = e => {
            if (Is.empty(this.stack)) return;

            this.events.trigger('router.leaving', this.route());
            
            // remove the current added url
            this.stack.pop();
            // get the previous url
            let url = this.stack.end();

            history.replaceState(e.state, null, url);

            this._buildCurrentRoute();

            // navigate to the current route

            this.scan();
        };
    }

    /**
    * Display the given url as the Current url
    * Without scanning the routes again
    *
    * @param string url
    */
    _setUrl(url) {
        this.events.trigger('router.leaving', this.route());

        this.stack.push(url);

        history.pushState(this.index++, null, url);

        this._buildCurrentRoute();
    }

    /**
     * Create new router collection
     * 
     * @param object groupOptions 
     * @param callback callback 
     * @returns RoutesCollection
     */
    static group(groupOptions, callback) {
        return new RoutesCollection(groupOptions, callback);
    }

    /**
     * Add new route
     * 
     * @param string|regex route 
     * @param Layout.Page page 
     * @param object options 
     */
    static add(route, page, options = {}) {
        if (Is.string(route)) {
            route = '/' + route.trim('/');
        }

        let [pattern, paramsList] = Router.generatePattern(route);

        Router.list[route] = Object.merge({
            route, page, pattern, paramsList,
        }, options);
    }

    /**
    * Generate pattern for given route
    *
    * @param string route
    * @returns array of regular expression, params names
    */
    static generatePattern(route) {
        let regex = new RegExp('{\:?([^/]+)}|(\\*)', 'g');

        let paramsList = [];

        let pattern = route.replace(regex, function (actualSegment, paramName) {
            if (actualSegment === '*') {
                paramsList.push('segment');
                return '(.+)';
            } else {
                paramsList.push(paramName);
                return actualSegment.includes(':') ? '(\\d+)' : '([^\/]+)';
            }
        });

        pattern = '^' + pattern + '$';

        return [pattern, paramsList];
    }
}

Router.list = {};

Router.WITH_QUERY_STRING = true;
Router.WITHOUT_QUERY_STRING = false;

DI.register({
    class: Router,
    alias: 'router',
});
