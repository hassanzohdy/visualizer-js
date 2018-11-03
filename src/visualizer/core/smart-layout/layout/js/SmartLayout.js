class SmartLayout {
    /**
     * Constructor
     */
    constructor() {
        for (let key in IncrementalDOM) {
            _const(key, IncrementalDOM[key]);
        }
    }
}

DI.register({
    class: SmartLayout,
    alias: 'smartLayout',
});

const Smart = {};

Application.autoLoad('smartLayout');