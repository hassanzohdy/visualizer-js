Form.Plugin = class extends Macroable {
    /**
     * Constructor
     */
    constructor(macroName) {
        if (macroName) {
            super({
                class: Form,
                name: macroName,
            });
            this.macroName = macroName;
        }
    }

    /**
     * Execute the plugin
     */
    run() { }
}