class Http {
    /**
    * Constructor
    *
    */
    constructor(events) {
        this.events = events;
        this.options = Config.get('http');
        if (typeof this.options.uploadablePut == 'undefined') {
            this.options.uploadablePut = true;
        }
    }

    /**
     * Send GET request
     * 
     * @param string|object url
     * @param object data
     * @returns Promise
     */
    get(url, options = {}) {
        return this._optimize('GET', ...arguments);
    }

    /**
     * Send POST request
     * 
     * @param string|object url
     * @param object data
     * @returns Promise
     */
    post(url, data, options = {}) {
        return this._optimize('POST', ...arguments);
    }

    /**
     * Send PUT request
     * 
     * @param string|object url
     * @param object data
     * @returns Promise
     */
    put(url, data, options = {}) {
        return this._optimize('PUT', ...arguments);
    }

    /**
     * Send PATCH request
     * 
     * @param string|object url
     * @param object data
     * @returns Promise
     */
    patch(url, data, options = {}) {
        return this._optimize('PATCH', ...arguments);
    }

    /**
     * Send DELETE request
     * 
     * @param string|object url
     * @returns Promise
     */
    delete(url) {
        return this._optimize('DELETE', ...arguments);
    }

    /**
     * Optimize request then send it
     * 
     * @param string method
     * @param object url
     * @param object data
     * @param object options
     */
    _optimize(method, url, data = {}, options = {}) {
        if (Is.object(url)) {
            options = url;
            if (!options.method) {
                options.method = method;
            }
        } else {
            options.data = data;
            options.url = url;
            options.method = method;
        }

        return this.send(options);
    }

    /**
     * Send an http request 
     * 
     * @param object options
     * @returns jQUeryAjax
     */
    send(options) {
        options.method = (options.method || 'GET').toUpperCase();

        // if the given data is a jquery element
        // then we will assume it is a jquery form element

        // because PATCH and PUT requests don't accept form data
        // so it will be exclusively to POST request
        if (['POST', 'PUT', 'PATCH'].includes(options.method)) {
            // a fix for sending form-data to back-end if the request method is PUT
            // as uploading files is not supported in the PUT requests
            if (options.method == 'PUT') {
                let uploadablePut = typeof options.uploadablePut != 'undefined' ? options.uploadablePut : (this.options.uploadablePut);
                if (uploadablePut) {
                    options.method = 'POST';
                    if (Is.formHandler(options.data)) {
                        options.data.set('_method', 'PUT');
                    } else if (Is.object(options.data)) {
                        options.data._method = 'PUT';
                    }
                }
            }

            if (!Is.empty(options.data) && (Is.jquery(options.data) || Is.formHandler(options.data))) {
                options.data = new FormData(options.data[0]);
                options.cache = false;
                options.processData = false;
                options.contentType = false;
            }

        }

        if (this.events.trigger('http.loading', options.url, options) === false) return;

        if (options.progress) {
            ajaxOptions.xhr = () => {
                var xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener("progress", (evt) => {
                    if (evt.lengthComputable && options.progress) {
                        var percentComplete = evt.loaded / evt.total;
                        /* Do something with upload progress here */
                        if (options.progress) {
                            options.progress(percentComplete);
                        }
                    }
                }, false);
                return xhr;
            };
        }

        // echo(options);

        let jqXHR = $.ajax(options);

        return new Promise((resolve, reject) => {
            jqXHR.then(resolve).catch((xhr, statusText, errorThrown) => {
                let response = xhr.responseJSON || xhr.responseText;
                reject(response, xhr.status, errorThrown, statusText, xhr);
            });
        });
    }

    /**
    * Load css url(s)
    *
    */
    stylesheets(urls) {
        let stylesheets = urls.map(url => {
            return $.getStylesheet(url);
        });

        return Promise.all(stylesheets);
    }

    /**
    * Load javascript files as we will add it to script tag
    *
    */
    scripts(urls) {
        let scripts = urls.map(url => {
            return this.send({
                url: url,
                cache: true,
                dataType: 'script',
            });
        });

        return Promise.all(scripts);
    }

    /**
     * Load all assets for javascript and css
     * 
     * @param array scripts
     * @param array stylesheets
     * @returns Promise
     */
    assets(scripts, stylesheets) {
        stylesheets = stylesheets.map(url => {
            return $.getStylesheet(url, linkTag => {
                linkTag.insertBefore('.app-style');
            });
        });

        scripts = scripts.map(url => {
            return this.send({
                url: url,
                cache: true,
                dataType: 'script',
            });
        });

        return Promise.all(scripts.concat(stylesheets));
    }
}

DI.register({
    class: Http,
    alias: 'http',
});