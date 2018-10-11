class QueryString {
    /**
     * Constructor
     */
    constructor() {
        this.params = {};
        this._collectParameters();
    }

    /**
     * Collect query string params
     */
    _collectParameters() {
        let url = window.location.href,
            separator = '&',
            str = url.split('?')[1];

        if (!str) return '';

        let splitedString = str.split(separator);

        for (let segment of splitedString) {
            segment = decodeURIComponent(segment);
            let [key, value] = segment.split('=');

            // if the key exists we will skip it if and only if it is not a compound name
            // compound names contain [] brackets
            if (typeof this.params[key] != 'undefined' && !key.includes('[]')) continue;

            if (typeof value == 'undefined') {
                value = '';
            }

            // escape the value
            value = _e(decodeURIComponent(value).replace(/\+/g, ' '));

            if (key.includes('[]')) {
                // remove the brackets from the key []
                key = key.replace(/\[\]/, '');

                if (typeof this.params[key] == 'undefined') {
                    this.params[key] = [];
                }

                this.params[key].push(value);
            } else {
                this.params[key] = value;
            }
        }
    }

    /**
     * Get all params
     */
    all() {
        return this.params;
    }

    /**
     * Get query string param by key
     * 
     * @param  string key
     * @param  mixed defaultValue
     * @returns mixed
     */
    get(key, defaultValue = null) {
        return Object.get(this.params, key, defaultValue);
    }
}