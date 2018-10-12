class ImageSelector extends Form.Plugin {
    /**
     * Constructor
     */
    constructor(dom) {
        super('imageSelector');
        this.dom = dom;
    }

    /**
    * Run the select class
    *
    * @param mixed selector
    */
    run(selector, options) {
        selector.hide();

        if (Is.callable(options.imagePlaceholder)) {
            options.imagePlaceholder = options.imagePlaceholder();
        }

        let dom = this.dom;

        $(selector).each(function () {
            let selector = $(this),
                imageBtn = dom.element('button', {
                    type: 'button',
                    class: 'btn image-preview-btn no-p',
                }).insertBefore(selector),
                image = dom.image(selector.data('src') || options.imagePlaceholder, trans('select-image')).addClass('image-preview').appendTo(imageBtn);

            selector.on('change', function () {
                if (this.files && this.files[0]) {
                    var reader = new FileReader();

                    reader.onload = function (e) {
                        image.attr('src', e.target.result);
                    }

                    reader.readAsDataURL(this.files[0]);
                }
            });

            imageBtn.on('click', function () {
                selector.click();
            });
        });
    }

    /**
     * {@inheritDoc}
     */
    macro(selector, options = {}) {
        return this.plugin('imageSelector').run(this.find(selector || '.image-file-input'), Object.merge({
            imagePlaceholder: Config.get('form.imageSelector.imagePlaceholder'),
        }, options));
    }
}

DI.register({
    class: ImageSelector,
    alias: 'imageSelectorForm',
});