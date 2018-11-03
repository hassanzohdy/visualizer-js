class Guardian extends Middleware {
    /**
     * {@inheritDoc}
     */
    name() {
        return 'guardian';
    }

    /**
     * {@inheritDoc}
     */
    handle(user, router) {
        if (! user.isLoggedIn()) {
            router.navigateTo('/login');
            return;
        }

        return Middleware.NEXT;
    }
}

DI.register({
    class: Guardian,
    alias: 'guardianMiddleware',
});