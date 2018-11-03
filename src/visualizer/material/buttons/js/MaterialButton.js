class MaterialButton {
    /**
     * Create new button
     * 
     * @param string html
     */
    constructor(html) {
        this.btn = $('<button />').html(html).addClass('mdc-button');
    }

    /**
     * Disable button
     * 
     * @returns this
     */
    disable() {
        this.btn.attr('disabled', true);

        return this;
    }

    /**
     * Add raised class
     * 
     * @returns this
     */
    raised() {
        return this.become('raised');
    }

    /**
     * Add outlined class
     * 
     * @returns this
     */
    outlined() {
        return this.become('outlined');
    }

    /**
     * Add dense class
     * 
     * @returns this
     */
    dense() {
        return this.become('dense');
    }

    /**
     * Indicates an icon element
     * 
     * @returns this
     */
    iconable() {
        this.btn.addClass(`mdc-button__icon`);

        return this;
    }

    /**
     * Add unelevated class
     * 
     * @returns this
     */
    unelevated() {
        return this.become('unelevated');
    }

    /**
     * Add the given effect type to the button
     * 
     * @param string effect
     * @returns this 
     */
    become(effect) {
        this.btn.addClass(`mdc-button--${effect}`);

        return this;
    }

    /**
     * Add primary color to the button
     * 
     * @returns this
     */
    primary() {
        return this.color('primary');
    }

    /**
     * Add primary secondary to the button
     * 
     * @returns this
     */
    secondary() {
        return this.color('secondary');
    }

    /**
     * Add event listener 
     * 
     * @param string event(s)
     * @param callback callback
     * @returns this 
     */
    on(event, callback) {
        this.btn.on(event, callback);

        return this;
    }

    /**
     * Add color theme to button
     * 
     * @param string colorType
     * @returns this
     */
    color(colorType) {
        this.btn.addClass(`mdc-theme--${colorType}`);

        return this;
    }

    /**
     * Print the button
     */
    toString() {
        return this.btn.toString();
    }
}