<?php
namespace System\View;

use System\Application;

class ViewFactory
{
     /**
     * Application Object
     *
     * @var \System\Application
     */
    private $app;

     /**
     * Base view folder
     *
     * @var string
     */
    private $baseView = '';

     /**
     * Constructor
     *
     * @param \System\Application $app
     */
    public function __construct(Application $app)
    {
        $this->app = $app;
    }

    /**
    * Render the given view path with the passed variables and generate new View Object for it
    *
    * @param string $viewPath
    * @param array $data
    * @return \System\View\ViewInterface
    */
    public function render($viewPath, array $data = [])
    {
        $relativeViewPath = $viewPath . '.php';

        if ($this->app->file->exists($relativeViewPath)) {
            return $this->newView($relativeViewPath, $data);
        }

        $storagePath = 'vendor/System/storage/Ash/Views/' . $viewPath . '.php';

        // if the storage path does exist and it should not recompiled
        // then we will stop the compiling
        if ($this->app->config('view.recompile') === false AND $this->app->file->exists($storagePath)) {
            return $this->newView($storagePath, $data);
        }

        // if the engine file does not exist
        // then trigger a fatal error xD
        $engineViewPath = $viewPath . '.ash.php';

        if (! $this->app->file->exists($engineViewPath)) {
            die('<b>' . $viewPath . ' View</b>' . ' does not exists in Views Folder');
        }

        $compiler = new Compiler($this->app, $viewPath);

        $compiler->compile();

        return $this->newView($storagePath, $data);
    }

    /**
    * Set Base view
    *
    * @param string $baseView
    * @return void
    */
    public function baseView($baseView)
    {
        $this->baseView = $baseView;
    }

    /**
    * Create new view
    *
    * @param string $viewPath
    * @param array $data
    * @return string
    */
    private function newView($viewPath, $data)
    {
        return (new View($this->app->file, $viewPath, $data))->getOutput();
    }
}