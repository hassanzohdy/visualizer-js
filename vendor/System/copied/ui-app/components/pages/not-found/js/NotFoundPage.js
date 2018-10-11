class NotFoundPage extends Layout.Page {
    /**
    * {@inheritdoc}
    */
    bootstrap() {
        this.name = 'notFound';
        this.viewName = 'not-found/page'; // the name of the view file
        this.title = trans('not-found');
    }
}