class Macroable {
    /**
     * Constructor
     * 
     * @param object options
     */
    constructor(options) {
        options.class.prototype[options.name] = options.macro || this.macro;
    }

    /**
     * Macro method
     * 
     * @returns callback
     */
    macro() { }
}