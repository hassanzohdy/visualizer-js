class UsersService extends Endpoint.Service {
    /**
     * {@inheritDoc} 
     */
    boot() {
        this.route = '/users';
    }
}

DI.register({
    class: UsersService,
    alias: 'usersService',
});