class jQueryManager {
    /**
    * Constructor
    *
    */
    constructor() {
        this.printable();
    }

    /**
    * Allow jquery elements to be printed automatically when used in html code
    *                           
    */
    printable() {
        jQuery.prototype.toString = function () {
            return this[0].outerHTML;
            // return $('<span />').html($(this)).html();
        };
    }
}

DI.register({
    class: jQueryManager,
    alias: 'jquery',
});

Application.autoLoad('jquery');