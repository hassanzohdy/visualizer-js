class CacheEngine {
    /**
    * Constructor
    *
    */
    constructor(crypto) {
        this.crypto = crypto;
        this.init();
        this.encryptValues = Config.get('cache.encryptValues', true);
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
    set(key, value, expiresAt = Cache.FOREVER) {
        let settings = {
            data: value,
            expiresAt: expiresAt,
        };

        value = this.encryptValues ? this.crypto.encrypt(settings) : JSON.stringify(settings);

        this.storage.setItem(this.key(key), value);

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

        let decryptedSettings = this.encryptValues ? this.crypto.decrypt(settings) : JSON.parse(settings);

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

Cache.FOREVER = 0;
Cache.FOR_ONE_HOUR = Date.now() + 3600 * 1000;
Cache.FOR_TWO_HOURS = Cache.FOR_ONE_HOUR * 2;
Cache.FOR_ONE_DAY = Cache.FOR_ONE_HOUR * 24;
Cache.FOR_ONE_MONTH = Cache.FOR_ONE_DAY * 30;
Cache.FOR_ONE_YEAR = Cache.FOR_ONE_MONTH * 12;

DI.register({
    class: CacheEngine,
    alias: 'cache',
});