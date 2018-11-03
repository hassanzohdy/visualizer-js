class SessionEngine extends CacheEngine {
    /**
    * Constructor
    *
    */
    constructor(crypto) {
        super(crypto);
    }

    /**
    * Initialize the class
    *
    */
    init() {
        if (!window.sessionStorage) {
            throw new Error('Browser does not support session storage');
        }

        this.storage = window.sessionStorage;
    }
}

DI.register({
    class: SessionEngine,
    alias: 'session',
});