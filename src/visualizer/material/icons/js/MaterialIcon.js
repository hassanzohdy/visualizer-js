class MaterialIcon {
    /**
     * Create new icon
     * 
     * @param string icon
     * @returns MaterialButton
     */
    constructor(icon) {
        this.icon = $('<i class="material-icons mdc-icon-button__icon" />').html(icon);
    }

    /**
     * print the icon
     */
    toString() {
        return this.icon.toString();
    }

    /**
     * Make the icon in `on` state
     * 
     * @param bool onState
     * @returns this
     */
    on(onState) {
        onState ? this.icon.addClass('mdc-icon-button__icon--on') :
                  this.icon.removeClass('mdc-icon-button__icon--on');
                  
        return this;
    }
}
