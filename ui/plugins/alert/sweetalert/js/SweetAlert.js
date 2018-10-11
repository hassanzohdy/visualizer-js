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
        options = Object.merge({
            showCancelButton: true,
            confirmButtonClass: 'btn btn-danger',
            cancelButtonClass: 'btn btn-default',
            reverseButtons: true,
        },options);

        let sweetAlert = swal(options);

        return {
            then(callback) {
                sweetAlert.then(result => {
                    if (result.value) {
                        callback();
                    }
                })
            }
        };
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
     * Display prompt message
     * 
     * @param string message
     * @param object options
     * @returns mixed
     */
    prompt() { }
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