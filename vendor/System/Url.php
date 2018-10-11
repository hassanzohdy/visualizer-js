<?php
namespace System;

class Url
{
     /**
     * Application Object
     *
     * @var \System\Application
     */
    protected $app;

    /**
    * Admin path
    *
    * @var string
    */
    public $adminPath = '/admin';

     /**
     * Constructor
     *
     * @param \System\Application $app
     */
    public function __construct(Application $app)
    {
        $this->app = $app;
                                                                  
        $this->adminPath = array_get($this->app->config, 'admin-path', $this->adminPath);
    }

     /**
     * Generate full link for the given path for admin
     *
     * @param string $path
     * @return string
     */
    public function adminLink($path)
    {
        return $this->link($this->adminPath . '/' . ltrim($path, '/'));
    }

     /**
     * Generate full link for the given path
     *
     * @param string $path
     * @return string
     */
    public function link($path)
    {
        return $this->app->request->baseUrl() . trim($path, '/');
    }

     /**
     * Redirect to the given path
     *
     * @param string $path
     * @param bool $isRelativePath
     * @return void
     */
    public function redirectTo($path, $isRelativePath = true)
    {
        $path = $isRelativePath ? $this->link($path) : $path;

        if ($this->app->request->isAjax()) {
            return $this->app->response->json([
                'redirect'  => $path,
            ]);
        }

        header('location:' . $path);

        exit;
    }

    /**
    * Get the previous link
    *
    * @return string
    */
    public function toBack()
    {
        return $this->app->request->server('HTTP_REFERER');
    }

    /**
    * Redirect back
    *
    * @return void
    */
    public function redirectBack()
    {
        header('location:' . ($this->toBack() ?: $this->link('/')));

        exit;
    }

     /**
     * Redirect to the given path for admin app
     *
     * @param string $path
     * @return void
     */
    public function redirectToAdmin($path)
    {
        $this->redirectTo($this->adminPath . $path);
    }
}