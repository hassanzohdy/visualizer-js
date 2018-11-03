class Bootstrap {
    /**
     * constructor
     */
    constructor() {
        this.plugins = {};

        let plugins = Config.get('bootstrap.plugins');

        if (plugins) {
            this.use(...plugins);
        }

        this.use(...Bootstrap.autoLoadedPlugins);
    }

    /**
     * Use the given plugins and register it
     * 
     */
    use(...plugins) {
        for (let plugin of plugins) {
            if (typeof this.plugins[plugin] == 'undefined') {
                let pluginObject = DI.resolve('bootstrap' + plugin.ucfirst());

                this.plugins[plugin] = pluginObject;

                if (pluginObject.autoLoading) {
                    this[plugin]();
                }
            }
        }
    }

    /**
     * Autoload the given plugin name
     * 
     * @param   string plugin
     * @returns void
     */
    static autoLoad(plugin) {
        Bootstrap.autoLoadedPlugins.push(plugin);        
    }
}

Bootstrap.autoLoadedPlugins = [];

DI.register({
    class: Bootstrap,
    alias: 'bootstrap',
});

Application.autoLoad('bootstrap');