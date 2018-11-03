// runtime configurations
Config.extend({
    layout: {
        basePath: 'layout/layout/layout-structure',
    },
    form: {
        validatable: true,
        freeze: {
            onSubmit: true,
            buttons: FormHandler.FREEZE_ALL,
        },
        plugins: [],
    },
    http: {
        endpoint: {
            baseUrl: '',
            apiKey: '', // used with the `key` for Authorization header 
        }
    }
});