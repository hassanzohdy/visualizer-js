class SweetAlert {
    constructor() {
        this.defaultDuration = Config.get('alert.sweetAlert.duration', 4000);
        this.defaultConfirmableAlert = Config.get('alert.sweetAlert.confirmableAlert', true);
        this.confirmableAlert = this.defaultConfirmableAlert;
    }

    /**
     * Display a confirm message
     * 
     * @param {object} options
     * @returns mixed 
     */
    confirm(options) {
        echo(options)
        return new Promise((resolve, reject) => {

            options = Object.merge({
                showCancelButton: true,
                confirmButtonClass: 'btn btn-danger',
                cancelButtonClass: 'btn btn-default',
                reverseButtons: true,
            }, options);

            let sweetAlert = swal(options);
            sweetAlert.then(result => {
                if (result.value) {
                    resolve(result.value);
                }
            })

        });
    }

    /**
     * Display a prompt box
     * 
     * @param object options 
     */
    prompt(options) {
        return this.confirm(Object.merge({
            type: 'question',
            className: 'animated fadeIn',
            // animation: false,
            input: 'text',
        }, options));
    }

    /**
     * Determine whether to display a confirm button or not
     * 
     * @param bool confirmableAlert
     * @returns this
     */
    confirmable(confirmableAlert) {
        this.confirmableAlert = confirmableAlert;

        return this;
    }

    /**
     * Display success message
     * 
     * @param string message
     * @param int duration
     * @param object options
     * @returns mixed
     */
    success(message, duration = this.defaultDuration, options = {}) {
        return this.alert(Object.merge({
            type: 'success',
            title: message,
            timer: duration,
        }, options));
    }

    /**
     * Display warning message
     * 
     * @param string message
     * @param int duration
     * @param object options
     * @returns mixed
     */
    warning() { }

    /**
     * Display error message
     * 
     * @param string message
     * @param int duration
     * @param object options
     * @returns mixed
     */
    error(message, duration = this.defaultDuration, options = {}) {
        return this.alert(Object.merge({
            type: 'error',
            title: message,
            timer: duration,
        }, options));
    }

    /**
     * Display info message
     * 
     * @param string message
     * @param int duration
     * @param object options
     * @returns mixed
     */
    info() { }
    /**
     * Display inform message with an ok button
     * 
     * @param string message
     * @param int duration
     * @param object options
     * @returns mixed
     */
    inform() { }

    /**
     * Create an alert
     * @param {object} options 
     */
    alert(options) {
        options.showConfirmButton = this.confirmableAlert;
        swal(options);
        this.confirmableAlert = this.defaultConfirmableAlert;
        // swal({
        //     title: 'Logged In',
        //     type: 'success',
        //     html:
        //         `Welcome Back ${resp.info.name}!`,
        //     showCloseButton: false,
        //     showCancelButton: false,
        //     // timer: 5000,
        //     showConfirmButton: true,
        //     focusConfirm: false,
        // });

    }
}

DI.register({
    class: SweetAlert,
    alias: 'sweetAlert',
});