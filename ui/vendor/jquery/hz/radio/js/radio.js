/**
* Radio Plugin
* This is a simple plugin for designing all radioes
* Please note self the current radio allowed class is "radio"
*
* @version v1.1
* @author Hasan Zohdy
* @released 24/07/2016
* @updated 24/04/2017
*/
(function ( $ ) {
    $.fn.radio = function (options) {
        return this.each(function () {
            new Radio(this, options || {});
        });
    };

    /**
    * Default radio icon
    *
    * @var string
    */
    $.fn.radio.defaultIcon = 'fa fa-circle';

    /**
    * Default radio style
    *
    * @var string
    */
    $.fn.radio.defaultBoxClass = 'input-primary';

    /**
    * Radioes
    * this function is responsible for handling all radioes
    *
    * @param jQuery Object radio
    * @param mixed options
    */
    function Radio(radio, options)
    {
        this.input = $(radio).addClass('radioed').hide();

        this.radioIcon = this.input.attr('data-icon-class') || options.iconClass || $.fn.radio.defaultIcon;

        this.radioIconElement = '<span class="input-icon ' + this.radioIcon + '"></span>';

        this.boxClass = this.input.attr('data-box-class') || options.boxClass || $.fn.radio.defaultBoxClass;

        this.radioBox = this.input.prev('.radio-input');

        if (this.radioBox.length == 0) {
            this.radioBox = $('<div class="radio-input ' + this.boxClass + '"></div>').insertBefore(this.input);
        }

        if (this.input.is(':disabled')) {
            this.radioBox.addClass('disabled');
        }

        this.radioBox.attr('data-name', this.input.attr('name'));

        this.displayRadio();

        this.adaptRadioOnClick();

        this.adaptRadioOnChange();
    }

    /**
    * Display radio element instead of the form element
    *
    */
    Radio.prototype.displayRadio = function () {
        if (this.input.is(':checked')) {
            this.radioBox.addClass('filled').html(this.radioIconElement);
        } else {
            this.radioBox.removeClass('filled').html('');
        }
    };

    /**
    * Adapt radio display on clicking
    *
    * @return void
    */
    Radio.prototype.adaptRadioOnClick = function () {
        var $this = this;

        this.radioBox.on('click', function () {
            if ($this.input.is(':disabled')) return;
            if (! $this.input.is(':checked')) {
                $this.input.prop('checked', true).trigger('change');
            }
        });
    };

    /**
    * Adapt radio input on change
    *
    * @return void
    */
    Radio.prototype.adaptRadioOnChange = function () {
        var $this = this;

        $this.input.on('change', $this.input, function () {
            if ($this.input.is(':checked')) {
                // first remove all filled radio inputs with same name
                var inputs = $('input[name="' + $this.input.attr('name') + '"]').not($(this));

                inputs.each(function () {
                    $(this).parent().find('.radio-input').removeClass('filled').html('');
                });

                $this.radioBox.addClass('filled').html($this.radioIconElement);
            }
        });
    };
}( jQuery ));