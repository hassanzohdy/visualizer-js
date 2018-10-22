class Application {
    /**
    * Constructor
    *
    */
    constructor() {
        // by default, if the developer doesn't change the `autoRun` property to false,
        // once the application loads, the `run` method will be called automatically after `init` method
        this.autoRun = true;
        this.onReady = function () {};
    }

    /**
     * Bootstrap the application
     * 
     * Please note that this method is triggered through the __run__ js file the is created through the compiler
     */
    __bootstrap() {
        this.prepareConfig();

        this.http = DI.resolve('http');
        this.events = DI.resolve('events');
        this.router = DI.resolve('router');
        this.layout = DI.resolve('layout');
        this.smartViews = DI.resolve('smartViews');

        this.events.on('ready', () => {
            for (let className of Application.autoLoadedClasses) {
                DI.resolve(className);
            }

            if (Config.get('app.env') === 'development') {
                let socket = new Socket('http://localhost:2020');

                socket.on('reload', () => {
                    window.stop();
                    document.location.reload();
                });
            }
            
            this.onReady();
        });

        // load external files if exists
        let stylesheets = [];
        if (typeof __EXTERNALS__ != 'undefined') {
            if (__EXTERNALS__.css) {
                if (!Is.empty(__EXTERNALS__.css.common)) {
                    stylesheets = stylesheets.concat(__EXTERNALS__.css.common);
                }

                let direction = Config.get('app.direction');

                if (!Is.empty(__EXTERNALS__.css[direction])) {
                    stylesheets = stylesheets.concat(__EXTERNALS__.css[direction]);
                }
            }

            let scripts = [];

            if (!Is.empty(__EXTERNALS__.js)) {
                scripts = __EXTERNALS__.js;
            }

            this.http.assets(scripts, stylesheets).then(() => {
                this.events.trigger('ready');
            });
        }

        $(window).on('load scroll resize', e => {
            this.events.trigger(e.type);
        });
    }

    /**
     * Trigger the given callback on app ready
     * 
     * @param callback callback
     * @returns this 
     */
    ready(callback) {
        this.onReady = callback;
    }

    /**
    * Set application configurations
    *
    * @param string config
    */
    prepareConfig() {
        // languages
        for (let locale in LANGUAGES) {
            LANGUAGES[locale].flag = assets(LANGUAGES[locale].flag);
        }

        // an alias to LANGUAGES
        _global('langs', LANGUAGES);

        // app configurations
        // env, appName, baseUrl, scriptPath
        let config = _C.split(',');
        Config.extend('app', {
            env: config[0],
            name: config[1],
            baseUrl: config[2],
            scriptPath: config[3],
            scriptUrl: config[2].rtrim('/') + config[3],
            direction: $('html').attr('dir') || 'ltr',
            localeCode: $('html').attr('lang') || 'en',
        });

        _const('BASE_URL', Config.get('app.baseUrl'));
        _const('SCRIPT_URL', Config.get('app.scriptUrl'));
    }

    /**
     * Auto call the given class|alias when the application is initialized
     * 
     * @param   string className
     * @returns void
     */
    static autoLoad(className) {
        Application.autoLoadedClasses.push(className);
    }

    /**
    * Run the application
    */
    run() {
        this.layout.bootstrap();
        setTimeout(() => {
            this.layout.renderPartials();
            this.router.scan();
        }, 0);
    }
}

Application.autoLoadedClasses = [];