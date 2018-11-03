class Dynamic {
    /**
    * Constructor
    *
    */
    constructor() {
        // if (!this.methods) {
        //     this.methods = this.getAllAvailableClassMethods();
        // }

        this.__object = this;

        // proxy for dynamic calls
        this._proxy = new Proxy(this, {
            set: (object, key, value, proxy) => {
                return object.__set(key, value, object) || true;
            },
            get: (object, key) => {
                // if (object.methods.includes(key)) {
                if (typeof object[key] == 'function') {
                    return (...args) => {
                        return object.__call(key, args, object);
                    }
                }  
                
                return object.__get(key, object);
            },
        });
        
        // this method is defined by user
        if (arguments.length > 0) {
            this.__construct(...arguments);
        } else {
            DI.resolve(this, '__construct');
        }

        return this._proxy;
    }

    /**
    * Get all class methods
    *
    * @return array
    */
    getAllAvailableClassMethods() {
        return eval(`Object.getOwnPropertyNames(${this.constructor.name}.prototype)`);
    }

    /**
    * Initialize the main info
    *
    */
    __construct() {}

    /**
    * Set the given key/values
    *
    */
    __set(key, value, object) {
        object[key] = value;
        return true;
    }

    /**
    * Get the value for the given key
    * Please note if the given key is stored in methods container
    * It will be returned as a method
    * Otherwise, it will be returned as a normal property
    *
    * Please note you may implement your own __get when you extend this class
    */
    __get(key, object) {
        return typeof object[key] != 'undefined' ? object[key] : null; 
    }

    /**
    * Magic calls for methods
    *
    */
    __call(key, args, object) {        
        return object[key].apply(object._proxy, args);
    }
}