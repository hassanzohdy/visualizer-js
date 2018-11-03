/**
* Checkbox Plugin
* This is a simple plugin for designing all checkboxes
* Please note self the current checkbox allowed class is "checkbox"
*
* @version v1.3
* @author Hasan Zohdy
* @released 24/07/2016
* @updated 11/10/2017
*/
(function ( $ ) {
    $.fn.checkbox = function (options) {
        return this.each(function () {
            new Checkbox(this, options || {});
        // }).trigger('change');
        });
    };

    $.fn.checkbox.defaultBoxClass = 'input-primary';

    /**
    * Checkboxes
    * this function is responsible for handling all checkboxes
    *
    * @param jQuery Object checkbox
    * @param mixed options
    */
    function Checkbox(checkbox, options) {
        this.input = $(checkbox);

        this.input.removeClass('checked-c');

        this.input.addClass('checked-c');

        this.input.hide();

        this.checkboxIcon = this.input.attr('data-icon-class') || options.iconClass || 'fa fa-check';

        this.boxClass = this.input.attr('data-box-class') || options.boxClass || $.fn.checkbox.defaultBoxClass;

        if (this.input.is(':checked')) {
            this.boxClass += ' filled';
        }

        this.checkboxIconElement = '<span class="check-icon ' + this.checkboxIcon + '"></span>';

        this.htmlBox = this.input.prev('.checkbox-input');

        if (this.htmlBox.length) {
            this.htmlBox.remove();
        }

        this.htmlBox = $('<div class="checkbox-input '  + this.boxClass + '"></div>').insertBefore(this.input);

        this.htmlBox.html(this.checkboxIconElement);

        if (this.input.is(':disabled') || this.input.attr('readonly')) {
            this.htmlBox.addClass('disabled');
        }

        this.input.addClass('checkboxed');

        this.adaptCheckboxOnClick();

        this.adaptCheckboxOnChange();
    }

    /**
    * Display checkbox element instead of the form element
    *
    */
    Checkbox.prototype.displayCheckbox = function () {
        if (this.input.is(':checked')) {
            this.htmlBox.addClass('filled');
        } else {
            this.htmlBox.removeClass('filled');
        }
    };                                   

    /**
    * Adapt checkbox display on clicking
    *
    * @return void
    */
    Checkbox.prototype.adaptCheckboxOnClick = function () {
        var $this = this;

        this.htmlBox.on('click', function () {
            if ($this.htmlBox.hasClass('disabled')) {
                return;
            }

            var checkedAttr = Boolean($this.input.prop('checked'));

            $this.input.attr('checked', ! checkedAttr).prop('checked', ! checkedAttr).trigger('change');
        });
    };

    /**
    * Adapt checkbox input on change
    *
    * @return void
    */
    Checkbox.prototype.adaptCheckboxOnChange = function () {
        var $this = this;

        $this.input.on('change', $this.input, function () {
            if ($(this).is(':checked')) {
                $this.htmlBox.addClass('filled');
            } else {
                $this.htmlBox.removeClass('filled');
            }
        });
    };
}( jQuery ));