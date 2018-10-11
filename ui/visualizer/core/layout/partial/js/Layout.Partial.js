class _Partial {    
    /**
     * Constructor
     * 
     * @param Application app
     */
    constructor(layout, events) {
        this.layout = layout;
        this.events = events;
        this.baseView = 'layout/common'; 
    
        this.events.on(`${this.name}.load` , () => {
            this.ready();
        });
    }

    /**
     * Set partial configurations
     */
    bootstrap() {
        this.name = ''; // partial name
        this.viewName = ''; // partial view name => default is partial name
        this.selector = ''; // partial selector in the layout => default is the partial name
    }

    /**
     * Render partial 
     * 
     * @param string viewPath
     * @param object data   
     * @returns void
     */
    view(viewPath, data = {}) {
        viewPath = this.baseView ? this.baseView + '/' + this.name + '/' + viewPath : viewPath;

        return render(viewPath, data, this);
    }

    /**
     * Render header view and set it in the layout
     * 
     * @returns void
     */
    render(data = {}) {
        let html = this.view(this.viewName || this.name, data);

        this.layout.render(this.name, html);
    }

    /**
     * The ready event is triggered once the content has been set
     * 
     */
    ready() {}  
    
    /**
    * Run the partial
    *
    */
    run() {
        this.render();
    }
}

Layout.Partial = _Partial;