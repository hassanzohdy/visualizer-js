class Select extends Form.Plugin {
    /**
    * Constructor
    *
    */
    constructor() {
        super('select');
    }

    /**
    * Run the select class
    *
    * @param jQuery selector
    */
    run(selector, options = {}) {
        $(selector).not('.no-select').each(function () {
            let select = $(this);

            let defaultValue = select.data('default-value'),
                defaultField = select.data('default-field') || 'id';

            if (select.attr('placeholder')) {
                options.placeholder = select.attr('placeholder');
                if (select.attr('data-allow-clear') == 'undefined') {
                    select.attr('data-allow-clear', true);
                };
            }

            if (select.attr('data-allow-clear')) {
                options.allowClear = true;
            }

            if (select.data('disable-search')) {
                options.minimumResultsForSearch = Infinity;

                select.on('select2:opening select2:closing', function () {
                    $(this).parent().find('.select2-search__field').prop('disabled', true);
                });
            }

            if (select.hasClass('tags')) {
                options.tags = true;
            }

            if (!options.dropdownCssClass) {
                options.dropdownCssClass = 'card';
            }


            if (!options.dir) {
                options.dir = $('html').attr('dir') || 'ltr';
            }

            if (select.hasClass('imageable')) {
                options.templateResult =
                    options.templateSelection = (state) => {

                        if (!state.id || !$(state.element).data('image')) {
                            return state.text;
                        }

                        return $(
                            '<span class="select2-image-container"><img src="' + $(state.element).data('image') + '" class="select2-img" /> ' + state.text + '</span>'
                        );
                    };
            } else if (select.hasClass('iconable')) {
                // render results
                options.templateResult =
                    options.templateSelection = (state) => {
                        if (!state.id) {
                            return state.text;
                        }

                        let optionText = '',
                            icon = $(state.element).data('icon');

                        if (icon) {
                            optionText = '<i class="' + icon + '"></i> ';
                        }

                        optionText += state.text;

                        return $('<span />').html(optionText);
                    };
            } else {
                // render results
                options.templateResult = options.templateSelection = state => {
                    if (!state.id) {
                        return state.text;
                    }

                    return $('<span />').html(state.text);
                };
            }

            if (select.data('limit')) {
                options.maximumSelectionLength = select.data('limit');
            }

            if (select.data('ajax-url')) {
                let url = select.data('ajax-url');
                let minimumInputLength = select.data('min-length') || 0;

                options.ajax = {
                    url: url,
                    type: 'POST',
                    dataType: 'json',
                    delay: 0,
                    cache: true,
                    data: function (params) {
                        return {
                            keywords: params.term, // search term
                        };
                    },
                    processResults: function (data, params) {
                        return {
                            results: $.map(data.items, function (item) {
                                return {
                                    text: item.text,
                                    slug: item.text,
                                    id: item.id
                                }
                            }),
                        };
                    },
                };

                options.minimumInputLength = minimumInputLength;
            }

            // if the default value is set, then we will autoload that value using ajax and inject it to our select
            if (typeof defaultValue != 'undefined' && defaultValue != '' && select.data('ajax-url')) {
                let data = {};

                data[defaultField] = defaultValue;
                
                $.ajax({
                    url: select.data('ajax-url'),
                    type: 'POST',
                    data: data,
                    dataType: 'json',
                    success: (results) => {
                        if (results.items && results.items.length > 0) {
                            for (let i = 0; i < results.items.length; i++) {
                                let item = results.items[i],
                                    selected = false;

                                if (defaultValue.includes(',')) {
                                    selected = defaultValue.split(',').includes(item.id);
                                } else {
                                    selected = defaultValue == item.id;
                                }

                                let option = new Option(item.text, item.id, selected, selected);
                                select.append(option);
                            }

                            select.select2(options);
                        }
                    },
                });
            }

            select.select2(options);
        });
    }

    /**
     * {@inheritDoc}
     */
    macro(selector = 'select') {
        return this.plugin('select').run(this.find(selector));
    }
}


DI.register({
    class: Select,
    alias: 'selectForm',
});