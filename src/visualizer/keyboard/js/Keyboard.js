class Keyboard {
    /**
    * Constructor
    *
    */
    constructor() {
        Keyboard.setKeys();

        this.events = {};

        this.onFiringEvent();
    }

    /**
     * Set Keyboard keys
     */
    static setKeys() {
        let codes = {
            'backspace': 8,
            'tab': 9,
            'enter': 13,
            'shift': 16,
            'ctrl': 17,
            'alt': 18,
            'pause/break': 19,
            'caps lock': 20,
            'esc': 27,
            'escape': 27,
            'space': 32,
            'page up': 33,
            'page down': 34,
            'end': 35,
            'home': 36,
            'left': 37,
            'up': 38,
            'right': 39,
            'down': 40,
            'insert': 45,
            'delete': 46,
            'command': 91,
            'left command': 91,
            'right command': 93,
            'numpad *': 106,
            'numpad +': 107,
            'numpad -': 109,
            'numpad .': 110,
            'numpad /': 111,
            'num lock': 144,
            'scroll lock': 145,
            'my computer': 182,
            'my calculator': 183,
            ';': 186,
            '=': 187,
            ',': 188,
            '-': 189,
            '.': 190,
            '/': 191,
            '`': 192,
            '[': 219,
            '\\': 220,
            ']': 221,
            "'": 222
        }

        // Helper aliases
        let aliases = {
            'windows': 91,
            'ctl': 17,
            'control': 17,
            'option': 18,
            'pause': 19,
            'break': 19,
            'caps': 20,
            'enter': 13,
            'return': 13,
            'spc': 32,
            'pgup': 33,
            'pgdn': 34,
            'ins': 45,
            'del': 46,
            'cmd': 91
        }

        // lower case chars
        for (i = 97; i < 123; i++) codes[String.fromCharCode(i)] = i - 32;

        // numbers
        for (var i = 48; i < 58; i++) codes[i - 48] = i;

        // function keys
        for (i = 1; i < 13; i++) codes['f' + i] = i + 111;

        // numpad keys
        for (i = 0; i < 10; i++) codes['numpad ' + i] = i + 96;

        Keyboard.keys = Object.assign({}, codes, aliases);
    }

    /**
     * Get keyboard key by code
     * 
     * @param int code
     * @returns string
     */
    static key(code) {
        return Object.key(Keyboard.keys, code).toLowerCase();   
    }

    /**
    * Start call all callbacks on keyboard event is fired
    *
    */
    onFiringEvent() {
        let $this = this;

        $(document).on('keydown', function (e) {
            if (typeof $this.events[e.which] != 'undefined') {
                let keyEvents = $this.events[e.which];

                for (let i = 0; i < keyEvents.length; i++) {
                    let callback = keyEvents[i](e);

                    if (callback === false) {
                        return false;
                    }
                }
            }
        });
    }

    /**
    * Trigger an event on pressing on the given keyboard button name
    *
    * @param string|array keys
    * @param function callback
    */
    onPressing(selector = document, keys, callback) {
        let key = null;

        // if there is only two arguments passed to this method
        // then arguments list will be keys, callback, selector = document
        if (arguments.length == 2) {
            callback = keys;
            keys = selector;
            selector = document;
        }
        
        $(selector).on('keydown', (e) => {
            if (Keyboard.isPressingOn(e, keys)) {
                callback(e);

                return false;
            }
        });
    }

    /**
     * Determine whether the current user is pressing on the giving keyboard keys
     * 
     * @param Event event
     * @param string|array keys
     * @returns bool
     */
    static isPressingOn(event, keys) {
        if (! event.which) return false;
        if (Is.string(keys)) {
            keys = keys.toLowerCase().replace(/\s+/, '').split('+');
        }

        for (let key of ['alt', 'shift', 'ctrl']) {
            if (keys.includes(key)) {
                Array.remove(keys, key);
                if (!event[`${key}Key`]) return false;
            }
        }

        if (Is.empty(keys)) return true;

        let key = keys[0];

        if (event.key) return event.key.toLowerCase() === key;

        return Keyboard.key(event.which) === key;
    }
}


DI.register({
    class: Keyboard,
    alias: 'keyboard',
});