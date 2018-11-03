class Observer {
    static observe(object, objectKey, host) {
        if (! ['Array', 'Object'].includes(object.constructor.name)) return;
        if (!Observer.isObserving(host, objectKey)) {
            Observer.watch(object, objectKey, host);
        }
    }

    /**
     * Determine if the given key is being observed for the given host
     * 
     * @param   Proxy host
     * @param   string key
     * @returns bool 
     */
    static isObserving(host, key) {
        return Object.get(Observer.observed, host.__object.constructor.name + '.' + key, null) !== null;
    }

    /**
     * Observe the given object
     * 
     * @param   object object
     * @param   string key
     * @param   Proxy host
     * @returns void
     */
    static watch(object, key, host) {
        if (! Observer.observed[host.__object.constructor.name]) {
            Observer.observed[host.__object.constructor.name] = {};
        }

        let clonedObject = Observer.clone(object);
        
        Observer.observed[host.__object.constructor.name][key] = object;
        setInterval(() => {
            let objectsAreMatched = Object.match(
                object,
                clonedObject
            );
            if (! objectsAreMatched) {
                clonedObject = Observer.clone(object);
                host.__updateDOM();
            }

        }, 10);
    }

    /**
     * Clone the given object and get a new instance of it
     * 
     * @param   object object
     * @returns object
     */
    static clone(object) {
        return Is.array(object) ? Array.clone(object) : object.clone();
    }
}

Observer.observed = {};