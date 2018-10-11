class AlertItem {
    /**
    * Constructor
    *
    */
    constructor(options, app) {
        this.options = options;

        this.app = app;

        this.buildHtml();

        this.overlay = null;

        if (this.options.overlay) {
            let overlayId = 'alert-overlay-' + this.app.random.id();
            let overlay = Object.merge({
                position: 'append',
                parent: 'body',
                zIndex: 9999,
                id: overlayId,
            }, this.options.overlay);

            this.overlay = this.app.overlay.get(overlayId) || this.app.overlay.create(overlay);
        }

        if (this.options.autoplay) {
            if (this.overlay) {
                this.overlay.show();
            }

            this.show();
        }

        if (this.options.autoPosition) {
            this.positionElement();
        }

        if (this.options.css) {
            this.element.css(this.options.css);
        }

        this.removeOnClick();

        this.removeOnOverlayClick();
    }

    /**
    * Remove the alert when clicking on the overlay
    *
    */
    removeOnOverlayClick() {
        if (this.options.closeOnOverlayClick === true && this.overlay) {
            this.overlay.on('click', () => {
                this.remove();
            });
        }
    }

    /**
    * Remove alert on click
    *
    */
    removeOnClick() {
        if (this.options.removeOnClick === true) {
            this.element.on('click', () => {
               this.remove();
            });
        }
    }

    /**
    * Display the alert
    *
    */
    show(animation = this.options.animation.display) {
        if (['fadeIn', 'show', 'slideDown'].includes(animation)) {
            this.element[animation]();
        } else {
            this.app.animate.element(this.element.show(), this.options.animation.display);
        }
                          
        // remove the alert after the given duration of time
        // if duration is set to zero
        // then the alert won't be removed automatically
        if (this.options.duration > 0) {
            setTimeout(() => {
                this.remove();
            }, this.options.duration);
        }
    }

    /**
    * Position element in the middle of the top page
    * if there are any alerts before this one
    * then we will add this alert after the last alert
    */
    positionElement() {
        let alerts = $('.alert-wrapper').not(this.element),
            height = alerts.length > 0 ? alerts.last().outerHeight(true) + 20 : 0;

        this.element.css({
            top: alerts.length * height,
            left: ($(window).width() - this.element.outerWidth(true)) / 2,
        });
    }

    /**
    * Remove the alert
    *
    */
    remove(animation = this.options.animation.hide) {
        // if the animation is one of the following
        // then we will use the normal jquery effect
        // otherwise, we will use the animation object

        if (this.overlay) {
            this.overlay.fadeThenRemove();
        }

        if (['fadeOut', 'hide', 'slideUp'].includes(animation)) {
            this.element[animation](() => {
                this.element.remove();
            });
        } else {
            this.app.animate.element(this.element, animation, () => {
                this.element.remove();
            });
        }
    }

    /**
     * Finish animation immediately
     */
    finish() {
        this.element.finish().remove();
    }

    /**
    * Build html for the current alert
    *
    */
    buildHtml() {
        if (! this.options.id) {
            this.options.id = this.app.random.id();
        }

        this.element = $('<span />').html(this.options.render(this)).children().first();

        if (! this.element.attr('id')) {
            this.element.attr('id', this.options.id);
        }

        $('body').append(this.element);
    }
}