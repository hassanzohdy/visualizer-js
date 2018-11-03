class DomBuilder {
    /**
    * Constructor
    */
    constructor() {
        // share it globally
        _global('dom', this);

        if (typeof DomBuilder.Meta != 'undefined') {
            this.meta = new DomBuilder.Meta;
        }
    }

    /**
    * Create a clearfix element
    */
    fx() {
        return '<div class="clearfix"></div>';
    }

    /**
    * Create an icon element
    *
    * @param string iconClass
    * @return jQuery object
    */
    icon(iconClass) {
        return $('<i class="' + iconClass + '"></i>');
    }

    /**
    * Create a font awesome element
    */
    fa(icon, tooltipTitle = null) {
        icon = this.icon('fa fa-' + icon);

        return tooltipTitle ? icon.attr('data-toggle', '').attr('title', tooltipTitle) : icon;
    }

    /**
    * Get a help icon
    */
    helpIcon(title, colorClass = '') {
        return this.fa('question-circle').attr('title', title).attr('data-toggle', 'tooltip').addClass(colorClass);
    }

    /**
    * Get a info icon
    */
    infoIcon(title, colorClass = '') {
        return this.fa('info-circle').attr('title', title).attr('data-toggle', 'tooltip').addClass(colorClass);
    }

    /**
     * Create new image
     *
     * @param string src
     * @param string alt
     * @param string|object dimensions 
     * @param string title
     */
    image(src, alt, dimensions, title) {
        title = title || alt || this.meta.title();

        let image = this.element('img', {
            src: src,
            alt: alt,
            title: title,
        });

        if (dimensions) {
            if (Is.string(dimensions)) {
                let [width, height] = dimensions.split('x');
                dimensions = { width, height };
            }

            image.css(dimensions);
        }

        return image;
    }

    /**
    * Scroll to the given element
    *
    * @param mixed element
    * @param int scrollPlus
    * @param int animationDuration
    */
    scrollTo(element, scrollPlus = 0, animationDuration = 0) {
        $('html, body').animate({
            scrollTop: element.offset().top + scrollPlus,
        }, animationDuration);
    }

    /**
     * Create new element
     *
     * @param string tagName
     * @param object attributes
     * @return jQuery object
     */
    element(tagName, attributes = {}) {
        let html = attributes.html || '',
            classes = '';

        if (attributes.classes) {
            classes = attributes.classes;
            delete attributes.classes;
            attributes.class = classes;
        }

        return $(`<${tagName} />`, attributes).html(html);
    }
}

DI.register({
    class: DomBuilder,
    alias: 'dom',
});

Application.autoLoad('dom');