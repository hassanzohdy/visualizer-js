/**
 * Get the next element of the array
 */
collect().macro('next', function () {
    if (typeof this.cursor == 'undefined') {
        this.cursor = -1;
    }

    if (this.count() == this.cursor) return;

    return this.get(++this.cursor);
});

/**
 * Get the current element of the array
 * 
 */
collect().macro('current', function () {
    if (typeof this.cursor == 'undefined' || this.cursor == -1) {
        return;
    }

    return this.get(this.cursor);
});

/**
 * Get the previous element of the array
 * 
 */
collect().macro('prev', function () {
    if (typeof this.cursor == 'undefined' || this.cursor == 0) {
        return;
    }

    return this.get(--this.cursor);
});

/**
 * Reset the cursor to the start of the array
 */
collect().macro('rewind', function () {
    this.cursor = -1;
});