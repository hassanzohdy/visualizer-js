class BootstrapTooltip extends Bootstrap.Plugin {
    /**
    * Constructor
    *
    */
    constructor() {
        super('tooltip');
        // Clear any tooltip when user clicks on anchor tag or button
        $(document).on('click focus', 'a, button', function () {
            $(this).tooltip('hide');
        });

        // autoload the plugin once the bootstrap is resolved
        this.autoLoading = true;
    }

    /**
    * Register the object
    *
    * @param jQuery selector
    */
    macro(selector = '[data-toggle="tooltip"], [tooltip]') {
        let options = {
            html: true,
            trigger : 'hover',
            desktopOnly: true,
            mainSelector: 'body',
        };

        if (typeof selector == 'object') {
            options = Object.assign({}, options, selector);
        } else {
            options.selector = selector;
        }

        if (options.desktopOnly === true) {
            if (Is.desktop()) {
                $(options.mainSelector).tooltip(options);
            }
        } else {
            $(options.mainSelector).tooltip(options);
        }
    }
}

DI.register({
    class: BootstrapTooltip,
    alias: 'bootstrapTooltip',
});

Bootstrap.autoLoad('tooltip');