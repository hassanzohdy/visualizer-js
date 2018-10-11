class RoutesCollection {
    /**
     * Constructor
     *  
     * @param object groupOptions 
     * @param callback callback 
     */
    constructor(groupOptions, callback) {
        this.options = groupOptions;

        if (groupOptions.prefix) {
            groupOptions.prefix = '/' + groupOptions.prefix;
        }

        this.options.middleware = this.options.middleware || [];

        callback(this);
    }

    /**
     * Create new router collection
     * 
     * @param object groupOptions 
     * @param callback callback 
     * @returns RoutesCollection
     */
    group(options, callback) {
        if (this.options.prefix) {
            options.prefix = options.prefix ? this.options.prefix + options.prefix : this.options.prefix;
        } 

        if (this.options.middleware) {
            options.middleware = options.middleware ? this.options.middleware.concat(options.middleware) : this.options.middleware;
        }

        if (this.options.baseView) {
            options.baseView = options.baseView ? this.options.baseView + '/' + options.baseView : this.options.baseView;             
        }
    
        return Router.group(options, callback);
    }

    /**
     * Add new route
     * 
     * @param string|regex route 
     * @param Layout.Page page 
     * @param object options 
     */
    add(route, page, otherOptions = {}) {
        if (this.options.prefix) {
            route = this.options.prefix + route;
        }

        if (this.options.baseView) {
            otherOptions.baseView = otherOptions.baseView ? this.options.baseView + '/' + otherOptions.baseView : this.options.baseView;
        }

        let options = Object.merge(this.options, otherOptions);

        delete options.prefix;

        Router.add(route, page, options);
    }
}
