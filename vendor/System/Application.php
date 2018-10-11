<?php
namespace System;

use Closure;
use Whoops\Run AS Whoops;
use Illuminate\Container\Container;
use Whoops\Util\Misc AS WhoopsMIsc;
use Whoops\Handler\PrettyPageHandler;
use Whoops\Handler\JsonResponseHandler;

class Application extends Container
{
    /**
    * Framework Version
    *
    * @const string
    */
    const VERSION = '3.7';

     /**
     * Container
     *
     * @var array
     */
    private $container = [];

     /**
     * Application Object
     *
     * @var \System\Application
     */
    protected static $instance;

     /**
     * Constructor
     *
     * @param \System\File $file
     */
    private function __construct(File $file)
    {
        $this->share('file', $file);

        $config = json_decode($this->file->content('config.json'), true);

        $config = array_merge($config, [   
            'debug' => $config['env'] === 'development',
            'view' => [
                'recompile' => true,
                'compress' => false,
            ],
        ]);

        $this->share('config', $config);

        $this->handleErrors();

        $this->request->prepareUrl();
    }

    /**
    * Get config value
    *
    * @param string $key
    * @return mixed
    */
    public function config($key)
    {
        $config = array_flat($this->config);

        return array_get($config, $key);
    }

    /**
    * Handle errors and exceptions
    *
    * @return void
    */
    private function handleErrors()
    {;
        if ($this->config('debug') === true) {
            $run = new Whoops;

            $run->pushHandler(new PrettyPageHandler);

            if (WhoopsMisc::isAjaxRequest()) {
                $jsonHandler = new JsonResponseHandler;

                $jsonHandler->addTraceToOutput(true);

                $run->pushHandler($jsonHandler);
            }

            $run->register();
        } else {
            ini_set('display_errors', 0);
        }
    }

     /**
     * Get Application Instance
     *
     * @param \System\File $file
     * @return \System\Application
     */
    public static function getInstance($file = null)
    {
        if (is_null(static::$instance)) {
            static::$instance = new static($file);
        }

        return static::$instance;
    }

     /**
     * Run The Application
     *
     * @return void
     */
    public function run()
    {
        $output = $this->ui->run();

        $this->response->setOutput($output);

        $this->response->setHeader('X-Powered-By' , 'ASP.NET');

        $this->response->send();
    }

    /**
     * Render proper application
     * 
     * @return void
     */
    private function renderProperApp()
    {
        $currentRequest = $this->request->url();

        $currentScriptRoute = '/';

        // get all scripts
        foreach (array_keys($this->config('apps')) AS $scriptRoute) {
            $scriptRoute = "/$scriptRoute";
            if (strpos($currentRequest, $scriptRoute) === 0) {
                $currentScriptRoute = $scriptRoute;
                break;
            }
        }
        
    }

    /**
    * An alias to env method
    *
    * @return string
    */
    public function mode()
    {
        return $this->env();
    }

    /**
    * Get application mode "environment"
    * i.e production, development...
    *
    * @return string
    */
    public function env()
    {
        return $this->config('env');
    }

    /**
    * Determine whether the current application in development mode
    *
    * @return bool
    */
    public function inDevelopmentMode()
    {
        return $this->mode() == 'development';
    }

    /**
    * Determine whether the current application in production mode
    *
    * @return bool
    */
    public function inProductionMode()
    {
        return $this->mode() == 'production';
    }

     /**
     * Get Shared Value
     *
     * @param string $key
     * @return mixed
     */
    public function get($key)
    {
        if (! $this->isSharing($key)) {
            if ($this->isCoreAlias($key)) {
                $this->share($key, $this->createNewCoreObject($key));
            } else {
                die('<b>' . $key . '</b> not found in application container');
            }
        }

        $value = $this->container[$key];

        // if the value is closure
        // then we will execute it and store the value of it again
        // in the container
        if ($value instanceof Closure) {
            $value = call_user_func($value, $this);
            $this->share($key, $value);
        }

        return $value;
    }

     /**
     * Determine if the given key is shared through Application
     *
     * @param string $key
     * @return bool
     */
    public function isSharing($key)
    {
        return isset($this->container[$key]);
    }

     /**
     * Unshare the given key from application
     *
     * @param string $key
     * @return void
     */
    public function unshare($key)
    {
        unset($this->container[$key]);
    }

    /**
    * Share the given key|value Through Application
    *
    * @param string $key
    * @param mixed $value
    * @return mixed
    */
   public function share($key, $value)
   {
       $this->container[$key] = $value;
   }

     /**
     * Determine if the given key is an alias to core class
     *
     * @param string $alias
     * @return bool
     */
    private function isCoreAlias($alias)
    {
        $coreClasses = $this->coreClasses();

        return isset($coreClasses[$alias]);
    }

     /**
     * Create new object for the core class based on the given alias
     *
     * @param string $alias
     * @return object
     */
    private function createNewCoreObject($alias)
    {
        $coreClasses = $this->coreClasses();

        $object = $coreClasses[$alias];

        return new $object($this);
    }

    /**
    * Get All Core Classes with its aliases
    *
    * @return array
    */
   private function coreClasses()
   {
       return [
            'request'       => 'System\\Http\\Request',
            'response'      => 'System\\Http\\Response',
            'load'          => 'System\\Loader',
            'html'          => 'System\\Html',
            'view'          => 'System\\View\\ViewFactory',
            'url'           => 'System\\Url',
            'ui'            => 'System\\UIManager',
       ];
   }

    /**
    * Get shared value dynamically
    *
    * @param string $key
    * @return mixed
    */
   public function __get($key)
   {
       return $this->get($key);
   }
}