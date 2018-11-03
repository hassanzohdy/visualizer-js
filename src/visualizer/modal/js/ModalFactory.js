class ModalFactory {
    /**
    * Constructor
    *
    */
    constructor(animator) {
        this._setDefaults();
        this.modals = new Map;
        this.lastModalId = null;
        this.animator = animator;
    }

    /**
     * Set modal defaults
     */
    _setDefaults() {
        this.defaultOptions = {
            heading: null,
            tabindex: false,
            animation: { // object | fade | null
                show: 'flipInX',
                hide: 'fadeOutUp',
            },
            closeBy: {
                keyboard: true,
                overlay: true, // true to close modal on click or 'false' to prevent it
                headingBtn: true,
            },
            removeOnHide: true,
            footer: null,
            before: {
                open: null, // on modal shown
                close: null, // when the modal is hidden
            },
            on: {
                load: null, // on modal shown
                hide: null, // when the modal is hidden
            },
            style: {
                width: '80%',
                margin: '2rem auto',
            },
            buttons: {
                headingCloseBtn: '<span class="close-btn" data-dismiss="modal"><span class="fa fa-times-circle"></span></span>', 
                confirmBtn: '',
                closeBtn: '',
            },
        };
    }

    /**
    * open modal wit the given options
    *
    * @param mixed options
    */
    open(options = {}) {
        if (!options.modalId) {
            options.modalId = Random.id();
        }

        let modalOptions = Object.merge(this.defaultOptions, options);

        if (options.style && Is.empty(options.style)) {
            delete modalOptions.style;
        }

        let modal = new Modal(this, modalOptions);

        this.lastModalId = modalOptions.modalId;

        // add the modal to the modals list
        this.modals.set(modalOptions.modalId, this.modal);

        return modal;
    }

    /**
    * Close the modal
    *
    */
    close(modalId = this.lastModalId) {
        if (!modalId) return;

        let modal = this.get(modalId);

        if (!modal) return;

        modal.close();
    }

    /**
     * Get modal by id
     * 
     * @param string modalId
     * @returns jQuery Object | undefined
     */
    modal(modalId) {
        return this.modals.get(modalId);
    }

    /**
     * Remove the given modal|modalId from modals list
     * 
     * @param string|Modal modal
     * @returns void
     */
    remove(modal) {
        if (Is.object(modal)) {
            modal = modal.modalId;
        }

        this.modals.delete(modal);
    }

    /**
    * Clear all modals
    *
    */
    clear() {
        // remove the objects
        for (let modal of this.modals) {
            modal.removeOnHide = true;
            modal.close();
        }
    }
}   

DI.register({
    class: ModalFactory,
    alias: 'modals',
});
