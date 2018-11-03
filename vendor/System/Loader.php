<?php
namespace System;

use Exception;

class Loader
{
     /**
     * Application Object
     *
     * @var \System\Application
     */
    private $app;

     /**
     * Controllers Container
     *
     * @var array
     */
    private $controllers = [];

     /**
     * Models Container
     *
     * @var array
     */
    private $models = [];

     /**
     * languages container
     *
     * @var array
     */
    private $languageFiles = [];

    /**
    * Base controller that will be added before each controller
    *
    * @var string
    */
    private $baseController;

    /**
    * Base model that will be added before any called model
    * So we won't need to add the base folder name for the model
    * if we want to write a full model path
    * then we will add \ before the model name
    *
    * @var string
    */
    private $baseModel;

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
     * Call the given controller with the given method
     * and pass the given arguments to the controller method
     *
     * @param string $controller
     * @param string $method
     * @param array $arguments
     * @return mixed
     */
    public function action($controller, $method, array $arguments = [])
    {
        $object = $this->controller($controller);

        return call_user_func_array([$object, $method], $arguments);
    }

     /**
     * Call the given controller
     *
     * @param string $controller
     * @return object
     */
    public function controller($controller)
    {
        $controller = $this->getControllerName($controller);

        if (! $this->hasController($controller)) {
            $this->addController($controller);
        }

        return $this->getController($controller);
    }

     /**
     * Determine if the given class|controller exists
     * in the controllers container
     *
     * @param string $controller
     * @return bool
     */
    private function hasController($controller)
    {
        return array_key_exists($controller, $this->controllers);
    }

     /**
     * Create new object for the given controller and store it
     * in controllers container
     *
     * @param string $controller
     * @return void
     */
    private function addController($controller)
    {
        try {
            $object = new $controller($this->app);

            // App\Controllers\HomeController
            $this->controllers[$controller] = $object;
        } catch (Exception $e) {
            echo $e->getMessage();
            pred($e->getTrace());
        }
    }

     /**
     * Get the controller object
     *
     * @param string $controller
     * @return object
     */
    private function getController($controller)
    {
        return $this->controllers[$controller];
    }

     /**
     * Get the full class name for the given controller
     *
     * @param string $controller
     * @return string
     */
    private function getControllerName($controller)
    {
        $controller .= 'Controller';

        if ($this->baseController AND strpos($controller, '\\') !== 0) {
            $controller = $this->baseController . '\\' . $controller;
        } elseif (strpos($controller, '\\') === 0) {
            $controller = trim($controller , '\\');
        }

        $controller = 'App\\Controllers\\' . $controller;

        return str_replace('/', '\\', $controller);
    }

    /**
    * Set base controller name
    *
    * @param string $baseController
    * @return void
    */
    public function baseController($baseController)
    {
        $this->baseController = $baseController;
    }

    /**
    * Set base model name
    *
    * @param string $baseModel
    * @return void
    */
    public function baseModel($baseModel)
    {
        $this->baseModel = $baseModel;
    }

     /**
     * Call the given model
     *
     * @param string $model
     * @return object
     */
    public function model($model)
    {
        $model = $this->getModelName($model);

        if (! $this->hasModel($model)) {
            $this->addModel($model);
        }

        return $this->getModel($model);
    }

     /**
     * Determine if the given class|model exists
     * in the models container
     *
     * @param string $model
     * @return bool
     */
    private function hasModel($model)
    {
        return array_key_exists($model, $this->models);
    }

     /**
     * Create new object for the given model and store it
     * in models container
     *
     * @param string $model
     * @return void
     */
    private function addModel($model)
    {
        $object = new $model($this->app);

        // App\Models\HomeModel
        $this->models[$model] = $object;
    }

     /**
     * Get the model object
     *
     * @param string $model
     * @return object
     */
    private function getModel($model)
    {
        return $this->models[$model];
    }

     /**
     * Get the full class name for the given model
     *
     * @param string $model
     * @return string
     */
    private function getModelName($model)
    {
        $model .= 'Model';

        if ($this->baseModel AND strpos($model, '\\') !== 0) {
            $model = $this->baseModel . '\\' . $model;
        } elseif (strpos($model, '\\') === 0) {
            $model = trim($model , '\\');
        }

        $model = 'App\\Models\\' . $model;

        return str_replace('/', '\\', $model);
    }

     /**
     * Load the given language file and get the loaded keywords
     *
     * @param string $filePath
     * @return array
     */
    public function language($filePath)
    {
        if (! $this->languageHasFile($filePath)) {
            $this->addLanguageFile($filePath);
        }

        return $this->getLanguageFile($filePath);
    }

     /**
     * Determine if the given language file exists
     * in the languages file container
     *
     * @param string $filePath
     * @return bool
     */
    private function languageHasFile($filePath)
    {
        return array_key_exists($filePath, $this->languageFiles);
    }

     /**
     * Add new language file to language files container
     *
     * @param string $filePath
     * @return void
     */
    private function addLanguageFile($filePath)
    {
        $fileObject = $this->app->file;
        $languageObject = $this->app->language;
        $currentLocale = $languageObject->getLocale();

        $fullFilePath = 'App/languages/' . $currentLocale . '/' . $filePath . '.php';

        if (! $fileObject->exists($fullFilePath)) {
            throw new Exception(sprintf('Not found language file "%s"', $filePath, $fullFilePath));
        }

        $keywords = $fileObject->call($fullFilePath);

        $this->languageFiles[$filePath] = $keywords;

        $languageObject->addNewFile($filePath, $keywords);
    }

     /**
     * Get the loaded language file keywords
     *
     * @param string $filePath
     * @return array
     */
    private function getLanguageFile($filePath)
    {
        return $this->languageFiles[$filePath];
    }
}