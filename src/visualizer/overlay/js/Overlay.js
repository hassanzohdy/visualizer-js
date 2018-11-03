class Overlay {
    /**
    * Constructor
    *
    */
    constructor(animator) {
        this.animator = animator;

        this.defaultOptions = {
            zIndex: 1000,
            theme: 'dark',
            classes: '',
            opacity: 0.5,
            parent: 'body',
            position: 'append',
            show: false,
        };
    }

    /**
    * Create new overlay
    *
    * @param string theme
    * @param string position 'append' || 'prepend'
    * @param string id
    */
    create(theme = this.defaultOptions.theme, options = {}) {
        if (Is.object(theme)) {
            options = theme;
        } else {
            options.theme = theme;
        }

        if (!options.id) {
            options.id = Random.id();
        }

        options = Object.merge(this.defaultOptions, options);

        let overlayElement = this.createNewOverlay(options),
            parentElement = $(options.parent);

        // position => append || prepend
        parentElement[options.position](overlayElement);

        if (options.show) {
            if (Is.string(options.show)) {
                return this.animator.animate(overlayElement, options.show);
            }

            return overlayElement.show();
        } 

        return overlayElement;
    }

    /**
    * Create overlay jquery object
    *
    * @param object options
    * @return object
    */
    createNewOverlay(options) {
        return $('<div class="overlay-backdrop" />').attr({
            id: options.id,
        }).addClass(options.classes).css({
            background: options.theme == 'dark' ? 'rgba(0, 0, 0, ' + options.opacity + ')' : 'rgba(255, 255, 255, 0.5)',
            zIndex: options.zIndex,
        });
    }
}

DI.register({
    class: Overlay,
    alias: 'overlay'
});