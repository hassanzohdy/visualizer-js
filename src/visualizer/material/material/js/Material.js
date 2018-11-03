class Material {
    /**
     * This method is used to extend the class dynamically
     * 
     * @param string name
     * @param callback callbackValue
     */
    static extend(name, callbackValue) {
        Object.getter(Material, name, callbackValue);
    }
}

DI.register({
    class: Material,
    alias: 'material',
});