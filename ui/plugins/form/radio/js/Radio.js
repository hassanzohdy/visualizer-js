class Radio extends Form.Plugin {
    /**
    * Constructor
    *
    */
    constructor() {      
        super('radio');
    }

    /**
    * Register the object
    *
    * @param jQuery selector
    */
   run(selector, options = {}) {
       if (! options.boxClass) {
           options.boxClass = 'input-white';
       }
       
        $(selector).radio(options);
    }

    /**
     * {@inheritDoc}
     */
    macro(selector) {
        return this.plugin('radio').run(selector ? this.find(selector) : this.findByType('radio'));
    }
}

DI.register({
    class: Radio,
    alias: 'radioForm',
});