/**
 * This is the reverse to the guardian
 * which doesn't allow `logged-in` users to access the provided router
 * to this middleware
 */
class BlackGuardian extends Middleware {
    /**
     * {@inheritDoc}
     */
    name() {
        return 'blackGuardian';
    }

    /**
     * {@inheritDoc}
     */
    handle(user, router, layout) {
        if (user.isLoggedIn()) {
            router.navigateTo('/');
            return false;
        }

        // just make sure the current layout is for the not-logged-in page
        layout.build(Config.get('layout.basePath'));

        return Middleware.NEXT;
    }
}

DI.register({
    class: BlackGuardian,
    alias: 'blackGuardianMiddleware',
});