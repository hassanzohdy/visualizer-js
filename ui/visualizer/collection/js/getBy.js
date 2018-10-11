/**
 * Get an object by name for the given value
 * 
 * @param string name
 * @param mixed value
 * @returns mixed
 */
collect().macro('getBy', function (name, value) {
    let matchedItem;
    this.each(function (item) {
        if (item.name == value) {
            matchedItem = item;
        }
    });

    return matchedItem;
});