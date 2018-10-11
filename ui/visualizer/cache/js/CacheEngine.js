class CacheEngine {
    /**
    * Constructor
    *
    */
    constructor(crypto) {
        this.crypto = crypto;
        this.init();
    }

    /**
    * Initialize the class
    *
    */
    init() {
        if (! window.localStorage) {
            throw new Error('Browser does not support local storage');
        }

        this.storage = window.localStorage;
    }

    /**
    * Set the value for the given key
    *
    * @param string key
    * @param mixed value
    * @param int expiresAt Timestamp in milliseconds
    * @return this
    */
    set(key, value, expiresAt = 0) {
        let settings = {
            data: value,
            expiresAt: expiresAt,
        };

        let cipher = this.crypto.encrypt(settings);

        this.storage.setItem(this.key(key), cipher);

        return this;
    }

    /**
    * Get value for the given key
    *
    * @param string key
    * @param mixed defaultValue
    * @return mixed
    */
    get(key, defaultValue = null) {
        let settings = this.storage.getItem(this.key(key));

        if (! settings) return defaultValue;

        let decryptedSettings = this.crypto.decrypt(settings);

        if (! decryptedSettings) {
            this.remove(key);
            return defaultValue;
        }

        if (decryptedSettings.expiresAt && decryptedSettings.expiresAt < Date.now()) {
            this.remove(key);

            return defaultValue;
        }

        return decryptedSettings.data;
    }

    /**
    * Determine if the given key exists in cache
    *
    * @param string key
    * @return bool
    */
    has(key) {
        return this.get(key, null) !== null;
    }

    /**
    * Remove the given key from cache
    *
    * @param string key
    * @return void
    */
    remove(key) {
        this.storage.removeItem(this.key(key));
    }

    /**
    * Clear the cache repository
    *
    * @return void
    */
    clear() {
        this.storage.clear();
    }

    /**
    * Get the full key name as it will be compiled with the current app name
    *
    */
    key(key) {
        let cacheKey = key;

        return cacheKey;
    }
}

var Cache = CacheEngine;

Cache.FOR_ONE_HOUR = Date.now() + 3600 * 1000;
Cache.FOR_TWO_HOURS = Cache.FOR_ONE_HOUR * 2;
Cache.FOR_ONE_DAY = Cache.FOR_ONE_HOUR * 24;
Cache.FOR_ONE_MONTH = Cache.FOR_ONE_DAY * 30;
Cache.FOR_ONE_YEAR = Cache.FOR_ONE_MONTH * 12;

DI.register({
    class: CacheEngine,
    alias: 'cache',
});