Router.group({
    prefix: '/',
    baseView: 'pages',
}, router => {
    // home page
    router.add('/', HomePage);

    // add your routes 

    // Not found page
    router.add('*', NotFoundPage);
});
