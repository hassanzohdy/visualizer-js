class HomePage extends Layout.Page {
    /**
    * Set the main configurations of the page
    *
    * This method is triggered only once during the request life cycle
    */
    bootstrap() {
        this.name = 'home';

        this.viewName = 'home/page';

        this.title = trans('home');
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

class A extends Dynamic {
    __construct() {
        this.list = [];
    }
    __set(key, value) {
        this[key] = value;

        if (!Is.empty(this.list[key])) {
            for (let node of this.list[key]) {
                node.innerHTML = value;
            }
        }
    }
}