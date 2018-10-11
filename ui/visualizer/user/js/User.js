class User {
    /**
     * Constructor
     * 
     * @param Http http
     * @param CacheEngine cache
     * @param Router router
     * @param Events events
     */
    constructor(cache, events, router) {
        this.cache = cache;
        this.events = events;
        this.router = router;
        this.cacheEngineKey = 'userStorage';
        let cacheStorage = this.cache.get(this.cacheEngineKey, 'cache');

        this.cacheEngine = DI.resolve(cacheStorage);

        this.userCacheKey = '_u';

        this.accessTokenCacheKey = '_c';
    }

    /**
    * Initialize the object
    *
    */
    init() {
        if (this.isLoggedIn()) {
            this.info = this.cacheEngine.get(this.userCacheKey);

            delete this.info.accessToken;

            for (let key in this.info) {
                this[key] = this.info[key];
            }

            if (this.first_name && this.last_name) {
                this.name = this.first_name + ' ' + this.last_name;
            }

            if (!this.image) {
                this.image = appAssets('images/avatar.png');
            }

            this.events.trigger('access.granted', this);
        }
    }

    /**
     * Get user info
     * 
     * @param string key
     * @returns mixed
     */
    get(key) {
        return Object.get(this.info, key, '');
    }

    /**
     * Call the given callback once the user is marked as login
     * 
     * @param callable callback
     * @returns this
     */
    onLogin(callback) {
        if (this.isLoggedIn()) {
            callback(this);
        } else {
            this.events.on('access.granted', callback);
        }

        return this;
    }

    /**
     * Add callback on certain event
     */
    on(event, callback) {
        this.events.on(event, callback);
    }

    /**
     * Determine whether current user is logged in
     * 
     * @return bool
     */
    isLoggedIn() {
        return this.cacheEngine.has(this.accessTokenCacheKey);
    }

    /**
     * Get access token
     * 
     * @returns string
     */
    accessToken() {
        let cacheEngine = this.cache.get(this.cacheEngineKey);
        return this.cache.get(this.accessTokenCacheKey);
    }

    /**
     * This method is used when user is logged in successfully
     * And we need to save his access token key
     * 
     * @param object user
     * @return void
     */
    login(user, cacheEngine = 'cache') {
        this.cache.set(this.cacheEngineKey, cacheEngine);

        this.cacheEngine = DI.resolve(cacheEngine);

        this.cacheEngine.set(this.userCacheKey, user);

        this.cacheEngine.set(this.accessTokenCacheKey, user.accessToken);
        // change the layout to the logged-in one
        use('layout').rebuild(Config.get('layout.loggedInBasePath'));

        // call init method as it will automatically mark the user as logged-in
        this.init();
    }

    /**
     * Logout the user
     */
    logout() {
        this.cacheEngine.remove(this.accessTokenCacheKey);
        // change the layout to the not-logged-in one
        use('layout').rebuild(Config.get('layout.basePath'));
    }
}

User.ACCESS_TOKEN_KEY = 'u_a_t';

DI.register({
    class: User,
    alias: 'user',
});