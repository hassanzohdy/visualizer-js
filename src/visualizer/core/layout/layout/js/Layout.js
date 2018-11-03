class Layout {
    /**
    * Constructor
    */
    constructor(view, events) {
        this.events = events;
        this.view = view;

        this.partials = new Map;

        this.pages = new Map;
    }

    /**
     * Prepare layout configurations
     */
    bootstrap() {
        this._init();

        this.defaultBasePath = Config.get('layout.basePath');

        this.build(this.defaultBasePath);
    }

    /**
     * Build layout based on the given base view
     * 
     * @param string basePath
     * @returns void
     */
    build(basePath = this.defaultBasePath) {
        if (typeof this.container != 'undefined') {
            this.container.remove();
        }

        if (Is.callable(basePath)) {
            basePath = basePath();
        }

        this.container = $(basePath ? render(basePath) : this.view.render('core/layout/layout/base'));

        $('body').prepend(this.container);

        this.content = this.container.find('main');

        this.preparePartials();
    }

    /**
     * Rebuild layout with the given new basePath
     * 
     * @param string basePath
     */
    rebuild(basePath) {
        this.build(basePath);

        setTimeout(() => {
            this.renderPartials();
        }, 10);
    }

    /**
     * Initialize the layout
     * 
     * @returns void
     */
    _init() {
        for (let i = 0; i < Layout.partials.length; i++) {
            let partial = DI.resolve(Layout.partials[i].name);

            this.newPartial(partial);
        }
    }

    /**
     * Render the given partial content
     * 
     * @param string partialName
     * @param string content
     * @returns void
     */
    render(partialName, content) {
        if (partialName != 'content' && !this.partials.has(partialName)) {
            throw new Error(`Call to unknown partial: ${partialName}`);
        }

        if (this.events.trigger(`loading.${partialName}`, content, this) === false) return;

        let selector = partialName == 'content' ? 'main' :
            this.partials.get(partialName).selector || partialName;

        this.container.find(selector).html(content);

        this.events.trigger(`${partialName}.load`, content, this);
    }

    /**
     * Render Partials
     * 
     */
    preparePartials() {
        for (let [partialName, partial] of this.partials) {
            partial.prepare();
        }
    }

    /**
     * Render Partials
     * 
     */
    renderPartials() {
        for (let [partialName, partial] of this.partials) {
            partial.run();
        }
    }

    /**
    * Register new page partial
    *
    */
    newPartial(partial) {
        if (!partial.name) {
            throw new Error(`The passed partial component to layout must contain the name property for that page name`);
        }

        this.partials.set(partial.name, partial);

        this[partial.name] = partial;

        return this;
    }

    /**
     * Loop through all pages
     * 
     * @param callback callback
     * @returns this 
     */
    each(callback) {
        this.pages.forEach(callback);

        return this;
    }

    /**
    * Register new page
    *
    */
    newPage(pageOptions) {
        let page = DI.resolve(pageOptions.page.name);

        if (!page.name) {
            throw new Error(`The passed page component to layout must contain the name property for that page name`);
        }

        this.setupPage(page, pageOptions);

        this.pages.set(page.name, page);

        this[page.name] = page;

        return page;
    }

    /**
     * Setup the given page with the given options
     * 
     * @param Layout.Page page
     * @param object options
     */
    setupPage(page, options) {
        if (!Is.empty(options.middleware)) {
            page.middleware = page.middleware.concat(options.middleware);
        }

        page.baseView = options.baseView || null;
    }

    /**
    * Initialize the layout
    *
    */
    run() {
        for (let [pageName, pageComponent] of this.pages) {
            pageComponent.run();
        }
    }

    /**
    * Load on scroll
    *
    */
    onScroll(options) {
        options = Object.merge({
            selector: '.load-on-scroll',
            method: 'get',
            route: null,
            itemsKey: 'items', // the response key of items list 
            data: null,
            loadMoreWhen: (scrolled, wrapperHeight) => {
                return scrolled > wrapperHeight * 3 / 4;
            },
            loadingTemplate: () => {
                return $('<div class="clearfix text-center loading" />').html('<i class="fa fa-spin fa-spinner fa-lg"></i> <b>Loading</b>').css({
                    marginTop: '30px',
                    marginBottom: '30px',
                });
            },
            noResultsTemplate: (noResultsMessage) => {
                return $('<h1 class="no-results text-center font-2" styyle="clear:both;">' + noResultsMessage + '</h1>')
            },
        }, options);

        this.currentPage = 2;

        this.stopLoading = false;

        let wrapper = $(options.selector);

        if (wrapper.length == 0) return;

        wrapper.removeClass('load-on-scroll').removeAttr('data-page').removeAttr('data-target');

        wrapper.css('overflow', 'hidden');

        options.newSelector = 'l-o-srl';

        wrapper.addClass(options.newSelector);

        options.loadingTemplate = $(options.loadingTemplate());

        options.loadingTemplate.addClass('loading-on-scroll-text');

        this.events.on('scroll', () => {
            let wrapper = $('.' + options.newSelector);

            let scrolled = $(window).scrollTop();

            if (this.stopLoading === true) return;

            if (wrapper.length == 0) return;

            let wrapperHeight = wrapper.offset().top + wrapper.outerHeight(true);

            if (options.loadMoreWhen(scrolled, wrapperHeight)) {
                let ajaxData = options.data || {};

                if (Is.empty(ajaxData) && options.form) {
                    ajaxData = $(options.form).serialize();
                    if (!ajaxData) {
                        ajaxData = '';
                    }

                    ajaxData += '&page=' + this.currentPage;
                } else {
                    ajaxData.page = this.currentPage;
                }

                return this.endPoint({
                    route: options.route,
                    method: options.method,
                    data: ajaxData,
                    beforeSend: () => {
                        this.stopLoading = true;
                        wrapper.append(options.loadingTemplate);
                    },
                    success: (response) => {
                        wrapper.find('.loading-on-scroll-text').remove();

                        let items = response[options.itemsKey];

                        if (items.length > 0) {
                            this.currentPage++;

                            if (options.renderItems) {
                                options.renderItems(items, response, wrapper, options);
                            }

                            if (options.renderItem) {
                                for (let item of items) {
                                    options.renderItem(item, response, wrapper, options);
                                }
                            }

                            this.stopLoading = false;
                        } else {
                            this.stopLoading = true;

                            if (response.noResults) {
                                wrapper.html(options.noresponseTemplate(response.noResults));
                            }
                        }

                        // fire the event
                        this.events.trigger('scrolled.items.loaded', response);
                    },
                });
            }
        });
    }
}

DI.register({
    class: Layout,
    alias: 'layout',
});