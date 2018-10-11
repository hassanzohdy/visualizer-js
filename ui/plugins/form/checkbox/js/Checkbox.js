class Checkbox extends Form.Plugin {
    /**
    * Constructor
    *
    */
    constructor() {
        super('checkbox');
    }

    /**
    * {@inheritDoc}
    */
    run(selector, options = {}) {
        $(selector).checkbox(options);
    }

    /**
     * {@inheritDoc}
     */
    macro(selector) {
        return this.plugin('checkbox').run(selector ? this.find(selector) : this.findByType('checkbox'));
    }
}

DI.register({
    class: Checkbox,
    alias: 'checkboxForm',
});