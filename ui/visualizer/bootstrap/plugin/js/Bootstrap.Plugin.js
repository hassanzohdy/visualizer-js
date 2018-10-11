Bootstrap.Plugin = class extends Macroable {
    /**
     * Constructor
     */
    constructor(macroName) {
        if (macroName) {
            super({
                class: Bootstrap,
                name: macroName,
            });
            this.macroName = macroName;
        }
    }
}