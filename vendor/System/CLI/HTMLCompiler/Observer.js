class Observer {
    static observe(object, objectKey, hostProxy) {
        if (!this.observed[hostProxy._object.constructor.name]) {
            this.observed[hostProxy._object.constructor.name] = {};
        }

        this.observed[hostProxy._object.constructor.name][objectKey] = object;

        // proxy for dynamic calls
        let proxyObject = new Proxy(object, {
            set: (object, key, value) => {
                if (object[key] === value) return true;

                object[key] = value;
                if (hostProxy.isReady) {
                    hostProxy.__updateDOM();
                }
                return true;
            },

            deleteProperty: (object, key) => {
                if (Array.isArray(object)) {
                    // reset the array after deleting
                    object = object.splice(key, 1);
                } else {
                    delete object[key];
                }

                if (hostProxy.isReady) {
                    hostProxy.__updateDOM();
                }

                return true;
            }

        });

        return proxyObject;
    }
}

Observer.observed = {};