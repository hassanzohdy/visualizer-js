class Endpoint {
    /**
    * Constructor
    *
    */
    constructor(http, events) {
        this.http = http;
        this.events = events;
        this._authorizable = false; // if set to true then we will need to get the access token
        this.token = null;
        this._init();
    }

    /**
     * Initialize the endpoint and prepare its info
     */
    _init() {
        this.config = Config.get('http.endpoint');

        if (! this.config.baseUrl) {
            throw new Error('Endpoint Error: baseUrl is not defined in the config.js (http.endpoint.baseUrl)');
        }

        if (! Is.string(this.config.baseUrl)) {
            this.config.baseUrl = this.config.baseUrl[Config.get('app.env')];
        }

        this.baseUrl = this.config.baseUrl.rtrim('/');
    }

    /**
     * Set authorizeable to true or false to be sent with every request
     */
    authorizable(authorizable, token = null) {
        this._authorizable = authorizable;

        this.token = token;

        return this;
    }

    /**
     * Send GET request
     * 
     * @param string route
     * @param object data
     * @param object options
     */
    get(route, options = {}) {
        return this._optimize('GET', ...arguments);
    }

    /**
     * Send POST request
     * 
     * @param string route
     * @param mixed data
     * @param object options
     */
    post(route, data, options = {}) {
        return this._optimize('POST', ...arguments);
    }

    /**
     * Send PUT request
     * 
     * @param string route
     * @param mixed data
     * @param object options
     */
    put(route, data, options = {}) {
        return this._optimize('PUT', ...arguments);
    }

    /**
     * Send PATCH request
     * 
     * @param string route
     * @param object options
     */
    patch(route, data, options = {}) {
        return this._optimize('PATCH', ...arguments);
    }

    /**
     * Send DELETE request
     * 
     * @param string route
     * @param object options
     */
    delete(route, options = {}) {
        return this._optimize('DELETE', ...arguments);
    }

    /**
     * Optimize request then send it
     * 
     * @param string method
     * @param object route
     * @param object data
     * @param object options
     */
    _optimize(method, route, data = {}, options = {}) {
        options.data = data;
        options.route = route;
        options.method = method;

        if (this.events.trigger('endpoint.sending', route, options) === false) return;

        return this.send(options);
    }

    /**
     * Send an http request 
     * 
     * @param object route
     * @param object data
     * @param object options
     * @returns jqXHR
     */
    send(options) {
        if (! options.headers) {
            options.headers = {};
        }

        if (this._authorizable) {
            if (! this.token) {
                let user = DI.resolve('user');
                this.token = user.accessToken();    
            }

            options.headers.Authorization = 'Bearer ' + this.token;
        } else if (this.config.apiKey) {
            options.headers.Authorization = 'Key ' + this.config.apiKey;
        }

        options.url = this.baseUrl + options.route;

        options.dataType = 'json';

        options.url = options.url.trim('/');

        return this.http.send(options);
    }
}

DI.register({
    class: Endpoint,
    alias: 'endpoint',
});