class Item extends Dynamic {
    /**
    * Constructor
    *
    * @param object data
    */
    __construct(data) {
        this.originalData = data || {};

        this.data = new Map;

        for (let key in data) {
            this.data.set(key, data[key]);
        }
    }

    /**
    * Get a details value
    *
    * @param string key
    * @param int languageId
    * @returns mixed
    */
    _details(key, languageId) {
        let details = this.data.get('details');

        if (!details || !details[languageId]) return '';

        return details[languageId][key] || '';
    }

    /**
    * Determine whether the item is empty
    *
    * @returns bool
    */
    isEmpty() {
        return this.data.size == 0;
    }

    /**
     * {@inheritDoc}
    */
    __set(key, value) {
        return this.data.set(key, value);
    }

    /**
     * {@inheritDoc}
    */
    __get(key) {
        return this.data.has(key) ? this.data.get(key) : '';
    }

    /**
     * Iterate over data
     */
    [Symbol.iterator]() {
        return this.data.entries();
    }

    /**
     * Get all items
     * 
     * @returns object
     */
    all() {
        let data = {};

        for (let [key, value] of this.data) {
            data[key] = value;
        }

        return data;
    }
}