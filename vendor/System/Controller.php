<?php
namespace System;

abstract class Controller
{
     /**
     * Application Object
     *
     * @var \System\Application
     */
    protected $app;
    /**
    * Define the model name for this controller
    *
    * @var string
    */
    protected $model;

     /**
     * Constructor
     *
     * @param \System\Application $app
     */
    public function __construct(Application $app)
    {
        $this->app = $app;

        if ($this->model) {
            $this->model = $this->app->load->model($this->model);
        }
    }

    /**
    * Get details value from the given object if present
    *
    * @param mixed $object
    * @param string $key
    * @param int $languageId
    * @return mixed
    */
    protected function getDetailsValue($object, $key, $languageId)
    {
        return ($object AND ! empty($object->details[$languageId]->$key)) ?
               $object->details[$languageId]->$key :
               null;
    }

    /**
    * Encode the given value to json
    *
    * @param mixed $data
    * @return string
    */
    protected function json($data)
    {
        return $this->response->json($data);
    }

    /**
    * Redirect to not found page
    *
    * @return string
    */
    protected function notFound()
    {
        return $this->url->redirectTo($this->route->notFound);
    }

    /**
    * get a view data
    *
    * @param string $path
    * @param array $data
    * @return mixed
    */
    protected function view($path, array $data = [])
    {
        if (! array_key_exists('current_url', $data)) {
            $data['current_url'] = $this->request->fullUrl();
        }

        if (! array_key_exists('user', $data) AND $this->app->isSharing('user')) {
            $data['user'] = $this->user;
        }

        // global variable in the view file to get any variable
        // without any error throw
        if (! array_key_exists('_DATA', $data)) {
            $data['_DATA'] = function ($key, $default = null) use ($data) {
                return array_get($data, $key, $default);
            };
        }

        if (! array_key_exists('table', $data)) {
            // first we need to start pagination
            $this->pagination->paginate();

            $data['table'] = $this->html->table();
        }

        return $this->view->render($path, $data);
    }

     /**
     * Call shared application objects dynamically
     *
     * @param string $key
     * @return mixed
     */
    public function __get($key)
    {
        return $this->app->get($key);
    }
}