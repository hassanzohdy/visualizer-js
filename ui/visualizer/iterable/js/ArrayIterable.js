class ArrayIterable {
    /**
     * Iterate over data
     */
    [Symbol.iterator]() {
        return this.data().values();
    }

    /**
     * The data that will be used in the iteration
     * 
     * @returns array
     */
    data() {
        return [];
    }
}