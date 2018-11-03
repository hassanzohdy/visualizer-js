/**
 * Check if the given value exists in the collection
 * 
 * @param   mixed value
 * @returns bool
 */
collect().macro('includes', function (value) {
    return this.items.includes(value);
});