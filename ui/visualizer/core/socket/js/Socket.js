class Socket {
    /**
     * Constructor
     */
    constructor(url) {
        this.url = url;
        this.socket = io(this.url);   
    }

    /**
     * Add event listener to the given event
     * 
     * @param  string event
     * @param  callback callback
     * @returns this
     */
    on(event, callback) {
        this.socket.on(event, callback);

        return this;
    }

    /**
     * Trigger the given event
     * 
     * @param  string event
     * @param  callback callback
     * @returns this
     */
    emit(event, ...args) {
        this.socket.emit(event, ...args);

        return this;
    }

    /**
     * Alias to {emit}
     */
    trigger(...args) {
        return this.emit(...args);
    }
}