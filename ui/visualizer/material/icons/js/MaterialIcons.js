class MaterialIcons {
    /**
     * Create new button
     * 
     * @param string html
     * @returns MaterialButton
     */
    create(icon) {
        return new MaterialIcon(icon);
    }
}

DI.register({
    class: MaterialIcons,
    alias: 'materialIcons',
});

// usage: DI.resolve('material').icons.create(icon)...
Material.extend('icons', () => DI.resolve('materialIcons'));