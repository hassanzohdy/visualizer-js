class Locale {
    /**
    * Constructor
    *
    */
    constructor(cache, events) {
        this.cache = cache;
        this.events = events;
        this.keywords = {};

        this.locale = Config.get('app.localeCode');

        // available options: internal, external
        this.mode = Config.get('locale.mode', 'internal'); 

        this.eventsList = {
            loaded: 'locale.loaded',
        };

        this.globalize();

        this.load();
    }

    /**
    * A global and easy to use function called trans() will be used as reference to
    * this.get function
    */
   globalize() {
        _global('trans', (...args) => {
            return this.get(...args);
        });
    }

    /**
    * Set locale
    *
    */
    setLocale(locale) {
        this.locale = locale;
        this.cacheKey = 'locale-' + locale;
    }

    /**
    * load locale info again from server
    *
    */
    load() {
        if (this.mode == 'internal') {
            this._loadLocaleLocally();
        } else if (this.mode == 'external') {
            this.localeUrl = Config.get('locale.url');
            
            if (! this.localeUrl) {
                throw new Error(`Please specify the locale url to load locales`);
            }

            this.http.get(this.localeUrl).then(response => {
                this.keywords = response.locale;
                this.save();
                this.events.trigger(this.eventsList.loaded);
            });
        }
    }

    /**
     * Load locale locally from here
     */
    _loadLocaleLocally() {
        let locales = Locale.data;

        this.keywords = Object.get(locales, this.locale, {});

        this.events.trigger(this.eventsList.loaded);
    }

    /**
    * Add new keyword
    *
    * @param string keyword
    * @param string value
    */
    set(keyword, value) {
        this.keywords[keyword] = value;

        this.save();
    }

    /**
    * Get keyword value
    *
    * @param string keyword
    * @return string
    */
    get(keyword, ...replaces) {
        if (!keyword) return '';

        let translation = Object.get(this.keywords, keyword);

        return translation ?
            Is.string(translation) ? translation.vsprintf(replaces) : translation
            : keyword.capitalize();
    }

    /**
    * Check whether the given keyword exists
    *
    * @param string keyword
    * @return bool
    */
    has(keyword) {
        return typeof this.keywords[keyword] != 'undefined';
    }

    /**
    * Remove the given keyword from the locale
    *
    * @param string keyword
    * @return void
    */
    remove(key) {
        delete this.keywords[key];
    }

    /**
    * Clear all locale keywords
    *
    * @return void
    */
    clear() {
        this.keywords = {};
    }

    /**
    * Save locale
    *
    */
    save() {
        this.cache.set(this.cacheKey, this.keywords);
    }

    /**
    * Get all keywords
    *
    * @return object
    */
    all() {
        return this.keywords;
    }

    /**
     * Extend the given localeCode name
     * 
     * @param string localeCode
     * @param string namespace | object data
     * @param object data
     */
    static extend(localeCode, namespace, data) {
        if (!Locale.data[localeCode]) {
            Locale.data[localeCode] = {};
        }

        if (Is.object(namespace) && !data) {
            Locale.data[localeCode] = Object.merge(Locale.data[localeCode], namespace);
        } else if (Is.string(namespace) && data) {
            if (!Locale.data[localeCode][namespace]) {
                Locale.data[localeCode][namespace] = {};
            }
            
            Locale.data[localeCode][namespace] = Object.merge(Locale.data[localeCode][namespace], data);
        }
    }
}

Locale.data = {};

DI.register({
    class: Locale,
    alias: 'locale',
});

Application.autoLoad('locale');