class MaterialButtons {
    /**
     * Create new button
     * 
     * @param string html
     * @returns MaterialButton
     */
    create(html) {
        return new MaterialButton(html);
    }
}

DI.register({
    class: MaterialButtons,
    alias: 'materialButtons',
});

Material.extend('buttons', () => DI.resolve('materialButtons'));