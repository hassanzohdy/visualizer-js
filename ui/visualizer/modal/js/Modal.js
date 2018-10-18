class Modal {
    constructor(modalFactory, options) {
        this.modalFactory = modalFactory;
        this.options = options;

        let modal = view('modal/modal', { options });

        $('body').append(modal);

        this.element = $('#' + this.options.modalId);
        this.modalDialog = this.element.find('.modal-dialog');

        this.setContent(this.options.content);

        this.handleEvents();

        this.options.backdrop = this.options.closeBy.overlay === true ? true : 'static';

        this.options.keyboard = this.options.closeBy.keyboard;

        this.element.modal(this.options);

        for (let key in options) {
            this[key] = options[key];
        }
    }

    /**
     * Handle events
     */
    handleEvents() {
        this.element.on('show.bs.modal', () => {
            if (this.options.before && this.options.before.open) {
                this.options.before.open(this, this.element);
            }

            if (Is.object(this.options.animation) && this.options.animation.show) {
                let animation = this.options.animation.show,
                    speed = Animator.NORMAL_SPEED;

                if (Is.object(this.options.animation.show)) {
                    animation = this.options.animation.show.name;
                    speedMode = this.options.animation.show.speed;
                }

                this.modalFactory.animator.animate(this.modalDialog, animation, speed);
            }
        });

        this.element.on('shown.bs.modal', () => {
            if (this.options.on.load) {
                this.options.on.load(this, this.element);
            }
        });

        this.element.on('hide.bs.modal', e => {
            e.preventDefault();
            if (this.options.before && this.options.before.close) {
                this.options.before.close(this, this.element);
            }

            if (Is.object(this.options.animation) && this.options.animation.hide) {
                let animation = this.options.animation.hide,
                    speed = Animator.NORMAL_SPEED;

                if (Is.object(this.options.animation.hide)) {
                    animation = this.options.animation.hide.name;
                    speedMode = this.options.animation.hide.speed;
                }

                this.modalFactory.animator.animate(this.modalDialog, animation, speed).then(() => {
                    // hide and remove the backdrop manually
                    this.element.hide();
                    $('.modal-backdrop').hide();
                });
            }
        });

        this.element.on('hidden.bs.modal', () => {
            if (this.options.removeOnHide) {
                this.modalFactory.remove(this.modalId);
                this.element.remove();
            }
        });
    }

    /**
     * Add more event listeners to the on load event
     * 
     * @param callable callback 
     */
    onload(callback) {
        this.element.on('shown.bs.modal', () => {
            callback(this, this.element);
        });
    }

    /**
     * Update modal content
     * 
     * @param string content
     */
    setContent(content) {
        this.element.find('.modal-body').html(content);
    }

    /**
     * Close the modal
     */
    close() {
        this.element.modal('hide');
    }
}