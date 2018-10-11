class App extends Application {
    /**
    * Prepare application
    *
    */
    init() {
        // app initialized
        let locale = DI.resolve('locale');
        locale.load();
    }
}
