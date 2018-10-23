class EndpointService {
    /**
     * Constructor
     * 
     */
    constructor(endpoint) {
        this._endpoint = endpoint;

        this.authorizable = true;

        this.route = null; 
               
        DI.resolve(this, 'boot');

        if (! this.route) {
            throw new Error(`Endpoint Service Error: [${this.constructor.name} Class] => Please define the "route" property in the "boot" method.`);
        }
    }     

    /**
     * This method should be implement by the developer to set the 
     * endpoint service configurations like the route
     */
    boot() {}

    /**
     * Get record by id
     * 
     * @param int id
     * @returns Promise
     */
    get(id) {
        return this.endpoint.get(this.path('/' + id));
    }

    /**
     * Get records list
     * 
     * @param object data
     * @returns Promise
     */
    list() {
        return this.endpoint.get(this.path('/'));
    }

    /**
     * Create new record
     * 
     * @param mixed form
     */
    create(form) {
        return this.endpoint.post(this.path('/'), form);        
    }

    /**
     * Update record
     * 
     * @param int id
     * @param mixed form
     */
    update(id, form) {
        return this.endpoint.put(this.path('/' + id), form);        
    }

    /**
     * Delete Record record
     * 
     * @param int id
     */
    delete(id) {
        return this.endpoint.delete(this.path('/' + id));        
    }

    /**
     * Get route path
     * 
     * @param string path
     * @returns string
     */
    path(path) {
        return this.route + '/' + path.ltrim('/');
    }

    /**
     * Make sure to always update the authorizable value before accessing to the endpoint
     * 
     * @return Endpoint
     */
    get endpoint() {
        this._endpoint.authorizable(this.authorizable);

        return this._endpoint;
    }
}

Endpoint.Service = EndpointService;
