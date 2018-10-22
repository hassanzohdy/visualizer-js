class _Page {
    /**
    * Constructor
    */
    constructor(events, layout, dom, router, middleware, view) {
        this.dom = dom;
        this.views = view;
        this.events = events;
        this.layout = layout;
        this.router = router;
        this.middlewareCollection = middleware;

        this._setDefaults();

        this.events.on('content.load', () => {
            if (this.route == this.router.current.route) {
                this.ready();
            }
        });

        DI.resolve(this, 'bootstrap');

        if (this.smartView) {
            this.smartView = Config.get('app.name') + '/' + this.smartView;
        }
    }

    /** 
     * Default parameters list
     */
    _setDefaults() {
        this.name = ''; // page name
        this.title = ''; // page title

        // Base View Method
        this.viewName = ''; // if set, it will be rendered automatically once the visitors hits the page route  
        this.baseView = ''; // if specified, then any view name sent to `view` method will be related to this base view, also view scope will be current class

        this.html = ''; // to put html without views

        this.smartView = ''; // smart view path

        // middleware list
        this.middleware = [];
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
        for (let middleware of this.middleware) {
            let next = this.middlewareCollection.negotiateWith(middleware);

            if (next !== Middleware.NEXT) return next;
        }

        if (this.beforeInit() === false) return;

        $('body').attr('id', this.name + '-page');

        this.init();

        if (this.smartView) {
            this.__updateDOM();
        }

        if (this.viewName) {
            this.html = this.view(this.viewName);
        }

        if (this.html) {
            this.render(this.html);
        }

        if (this.title) {
            this.setTitle(this.title);
        }
    }

    /**
     * Render smart view
     */
    __updateDOM() {
        let view = SMART_VIEWS[this.smartView];

        patch(document.getElementsByTagName('main')[0], view, this);
    }

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
     * Set page content
     * 
     * @param string content
     * @return this
     */
    render(content) {
        this.layout.render('content', content);
    }

    /**
     * Triggered only when page content is set
     */
    ready() { }

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
     * Get the original view content without rendering it
     * 
     * @param string viewName
     * @returns string
     */
    originalView(viewName) {
        if (!this.baseView) {
            throw new Error('Please set the base view path first');
        }

        return this.views.originalView(Config.get('app.name') + '/' + this.baseView + '/' + viewName);
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

Layout.Page = _Page;