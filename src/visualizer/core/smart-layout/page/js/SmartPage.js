Smart.Page = class extends Dynamic {
    /**
    * Constructor
    */
    __construct(events, dom, router, middleware) {
        this.dom = dom;
        this.events = events;
        this.router = router;
        this.middlewareCollection = middleware;

        this._setDefaults();

        DI.resolve(this, 'bootstrap');

        if (!this.viewName) {
            throw new Error(`${this.constructor.name} MUST HAVE 'viewName' property to define the view path`);
        }

        if (this.propertiesToBeReleased) {
            this.events.on('router.leaving', () => {
                if (this.router.current.route == this.route) {
                    for (let property of this.propertiesToBeReleased) {
                        this[property] = null;
                    }
                }
            });
        }
    }

    /** 
     * Default parameters list
     */
    _setDefaults() {
        this.name = ''; // page name
        this.title = ''; // page title

        // Base View Method
        this.viewName = 'page'; // if set, it will be rendered automatically once the visitors hits the page route  
        this.baseView = ''; // if specified, then any view name sent to `view` method will be related to this base view, also view scope will be current class

        this.html = ''; // to put html without views

        this.viewPath = ''; // smart view path

        // middleware list
        this.middleware = [];

        // properties to be released when leaving the current page
        this.propertiesToBeReleased = [];
    }

    /**
     * release the given property name when the user leaves the current page
     * 
     * @param   string ...properties
     * @returns void
     */
    release(...properties) {
        this.propertiesToBeReleased = this.propertiesToBeReleased.concat(properties);
    }

    /**
    * Set the page configurations
    * This method is triggered only once in the whole request
    *
    */
    bootstrap() { }

    /**
    * Run the page
    *
    */
    run() {
        this.isReady = true;

        if (this.middleware) {
            for (let middleware of this.middleware) {
                let next = this.middlewareCollection.negotiateWith(middleware);

                if (next !== Middleware.NEXT) return next;
            }
        }

        document.body.id = this.name + '-page';

        let mainContent = document.querySelector('main');

        mainContent.id = this.name + '-content';

        this.init();

        this.__updateDOM();

        if (this.title) {
            this.setTitle(this.title);
        }

        setTimeout(() => {
            this.ready();
        }, 0);
    }

    /**
     * Triggered when page is loaded in dom
     */
    ready() { }

    /**
     * This method is triggered just before going to the `init` method
     * This method MUST return true to be able to access the page 
     * 
     * @returns boolean
     */
    beforeInit() {
        return true;
    }

    /**
    * This method is triggered each time the visitors opens the route of current page
    *
    */
    init() { }

    /**
     * Set page title
     * 
     * @param string title
     * @return this
     */
    setTitle(title) {
        this.dom.meta.setTitle(title);

        return this;
    }

    /**
     * Load view by name only
     * Please note this method works only if `baseView` property is specified
     * 
     * @param string viewName
     * @param object data
     */
    view(viewName, data = {}) {
        if (!this.baseView) {
            throw new Error('Please set the base view path first');
        }

        return render(this.baseView + '/' + viewName, data, this);
    }

    /**
     * 
     * @param string key 
     * @param mixed value 
     */
    __set(key, value) {
        if (key == 'title') {
            this.setTitle(value);
            return true;
        } else if (Smart.Page.reservedKeywords.includes(key)) {
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
     * Render smart view
     */
    __updateDOM() {
        if (!this.viewPath && this.viewName) {
            if (this.baseView) {
                this.viewPath = this.baseView + '/' + this.viewName;
            }

            this.viewPath = Config.get('app.name') + '/' + this.viewPath;

            if (!SMART_VIEWS[this.viewPath]) {
                throw new Error(`Unknown view ${this.viewPath}`);
            }
        }

        if (! document.getElementById(`${this.name}-content`)) return;

        let view = SMART_VIEWS[this.viewPath];

        patch(document.getElementById(`${this.name}-content`), view.bind(this._proxy), this._proxy);
    }

    /**
     * Get loading text
     * 
     * @returns string
     */
    loadingView() {
        return `
        <div class="text-center">
            ${dom.fa('spin fa-spinner')}
            ${trans('loading')}....
        </div>
        `;
    }
}


Smart.Page.reservedKeywords = [
    'baseView',
    'route',
    'viewPath',
    'form',
];