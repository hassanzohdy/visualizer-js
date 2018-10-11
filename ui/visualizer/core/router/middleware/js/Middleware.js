class Middleware {
    /**
     * Get middleware name that will be used in any page
     * 
     * @returns string 
     */
    name() {}

    /**
     * Handle the request
     * 
     * @param mixed $next
     * @param Application app
     * @returns mixed
     */
    handle($next, app) {}
}

Middleware.NEXT = '__NEXT__';