Smart.Partial = class extends Dynamic {
    /**
     * Constructor
     * 
     * @param Application app
     */
    __construct() {
        this.baseView = 'layout/common';

        this.isReady = false;

        DI.resolve(this, 'bootstrap');
    }

    /**
     * Prepare info
     */
    prepare() {
        if (!this.viewPath) {
            if (!this.viewName) {
                this.viewName = this.name + '/' + this.name;
            }

            if (this.baseView) {
                this.viewPath = this.baseView + '/' + this.viewName;
            }

            this.viewPath = Config.get('app.name') + '/' + this.viewPath;

            if (!SMART_VIEWS[this.viewPath]) {
                throw new Error(`Unknown partial view ${this.viewPath}`);
            }

            this.view = SMART_VIEWS[this.viewPath];    
        }

        this.element = $(this.selector || this.name);
    }

    /**
     * Set partial configurations
     */
    bootstrap() {
        this.name = ''; // partial name
        this.viewName = ''; // partial view name => default is partial name
        this.selector = ''; // partial selector in the layout => default is the partial name
        this.viewPath = ''; // the final full path
    }

    /**
     * The event event is triggered before the is set
     * 
     */
    init() { }

    /**
     * 
     * @param string key 
     * @param mixed value 
     */
    __set(key, value) {
        if (Smart.Partial.reservedKeywords.includes(key)) {
            this[key] = value;
            return true;
        }

        if (!Is.object(value) && this[key] === value) return true;

        this[key] = value;

        if (typeof value === 'object') {
            Observer.observe(value, key, this._proxy);
        }

        if (this.isReady) {
            this.__updateDOM();
        }

        return true;
    }

    /**
     * Render header view and set it in the layout
     * 
     * @returns void
     */
    __updateDOM() {
        if (! this.element || this.element.length == 0) return;

        let element = this.element[0];

        patch(element, this.view.bind(this._proxy), this._proxy);
    }

    /**
    * Run the partial
    *
    */
    run() {
        if (!this.isReady) {
            this.isReady = true;
        }
        this.init();
        this.__updateDOM();
    }
}

Smart.Partial.reservedKeywords = [
    'viewPath'
];