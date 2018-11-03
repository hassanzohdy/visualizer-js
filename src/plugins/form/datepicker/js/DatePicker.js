class DatePicker extends Form.Plugin {
    /**
    * Constructor
    *
    */
    constructor() {
        super('datepicker');
    }

    /**
     * {@inheritdoc}
    */
    run(selector) {
        $(selector).each(function () {
            let input = $(this),
                options = {
                    autoclose: true,
                    show: true,
                    format: input.data('format') || 'dd-mm-yyyy',
                };

            let startDate = input.data('start-date');

            if (startDate) {
                options.startDate = startDate;
            }

            let endDate = input.data('end-date');

            if (endDate) {
                options.endDate = endDate;
            }

            input.datepicker(options).on('changeDate', function () {
                input.trigger('change');
            }).on('show.bs.modal shown.bs.modal hide.bs.modal hidden.bs.modal', function(event) {
                // prevent datepicker from firing bootstrap modal "show.bs.modal"
                event.stopPropagation(); 
            });
        });
    }

    /**
     * {@inheritDoc}
     */
    macro(selector = '.datepicker') {
        return this.plugin('datepicker').run(this.find(selector));
    }
}

DI.register({
    class: DatePicker,
    alias: 'datepickerForm',
});