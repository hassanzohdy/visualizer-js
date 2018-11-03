class placeholder extends Smart.Page {
    /**
    * Set the main configurations of the page
    *
    * This method is triggered only once during the request life cycle
    */
    bootstrap() {
        this.name = 'placeholder';

        this.viewName = 'page';

        this.title = trans('placeholder');
    }

    /**
     * This method is triggered once the visitors hits the home page route
     */
    init() {

    }

    /**
     * This method is triggered after the page content is rendered
     */
    ready() {
    }
}