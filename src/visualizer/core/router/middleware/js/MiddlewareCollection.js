class MiddlewareCollection {
    constructor() {
        this.middlewareList = new Map; 
    }
    /**
     * Add new middleware to the list
     * 
     * @param \Middleware middleware
     * @returns void
     */
    register(middleware) {
        this.middlewareList.set(middleware.name(), middleware);
    }

    /**
     * Get middleware instance
     * 
     * @param string name
     * @return Middleware
     */
    get(name) {
        if (! this.middlewareList.has(name)) {
            try {
                // once the middleware is resolved,
                // it will register itself in the middleware collection
                let middleware = DI.resolve(name + 'Middleware');
                this.register(middleware);
            } catch(e) {
                echo(e);
                throw new Error('Call to undefined middleware ' + name);
            };
        }

        return this.middlewareList.get(name);
    }

    /**
     * Activate the given middleware handler
     * 
     * @param string middlewareName
     * @returns mixed
     */
    negotiateWith(middlewareName) {
        return DI.resolve(this.get(middlewareName), 'handle');
    } 
}

DI.register({
    class: MiddlewareCollection,
    alias: 'middleware',
});