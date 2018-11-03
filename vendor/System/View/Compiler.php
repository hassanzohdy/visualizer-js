<?php
namespace System\View;

use System\Application;

class Compiler
{
     /**
     * Application Object
     *
     * @var \System\Application
     */
    private $app;

     /**
     * View Path
     *
     * @var string
     */
    private $viewPath;

     /**
     * The output from the view file
     *
     * @var string
     */
    private $output;

     /**
     * Constructor
     *
     * @param \System\Application $app
     * @param string $viewPath
     */
    public function __construct(Application $app, $viewPath)
    {
        $this->app = $app;

        $this->viewPath = $viewPath;
    }

    /**
    * Start Compiling
    *
    * @return void
    */
    public function compile()
    {
        $relativeViewPath = $this->viewPath . '.ash.php';

        $storagePath = 'vendor/System/storage/Ash/Views/' . $this->viewPath . '.php';

        if (! is_dir($storageDir = dirname($storagePath))) {
            mkdir($storageDir, 0777, true);
        }

        if (! $this->app->file->exists($relativeViewPath)) {
            die('<b>' . $this->viewPath . ' View</b>' . ' does not exists in Views Folder');
        }

        $fileContent = $this->app->file->content($relativeViewPath);

        $this->output = $this->startConversion($fileContent);

        if ($this->app->config('view.compress') === true) {
            // compress the output
            $this->output = $this->app->html->compress($this->output);
        }

        $this->app->file->put($storagePath, $this->output);
    }

    /**
    * Start Conversion
    *
    * @return string
    */
    private function startConversion($content)
    {
        $compilers = [
            // convert any html special characters
            // and convert all &amp; to &
            '/\{\{(.+?)\}\}/' => '<?php echo $1; ?>',
            // convert any echo statement
            '#\{\!\!(.+?)\!\!\}#is' => '<?php echo $1; ?>',
            // Control Start
            '#@(if|while|foreach|for)\s?\((.*?)\)#iU' => '<?php $1 ($2) : ?>',
            // elseif
            '#@elseif\s\((.*?)\)#iU' => '<?php elseif ($1): ?>',
            // else
            '/@(else)(\s*)/' => '<?php else: ?>',
            // Control End
            '#@end(if|while|foreach|for)#iU' => '<?php end$1; ?>',
            // echo call function
            '#\@echo\((.*?)\)+#iU' => '<?php echo $1; ?>',
            // execute php code
            '#\@php\((.*?)+\)#iU' => '<?php $1; ?>',
            // translate function
            '#\@trans\((.*?)\)+#iU' => '<?php echo trans($1); ?>',
            // pre function
            '#\@pre\((.*?)\)+#iU' => '<?php pre($1); ?>',

           // pred function
            '#\@pred\((.*?)\)+#iU' => '<?php pred($1); ?>',
            // restore any html code function
            '#\@restore\((.*?)\)+#iU' => '<?php echo restore($1); ?>',
            // settings function
            '#(\@settings\((.*?))+\)#iU' => '<?php echo settings($2); ?>',
            // url function
            '#\@url\((.*?)\)+#iU' => '<?php echo url($1); ?>',
            // assets function
            '#\@assets\((.*?)\)+#iU' => '<?php echo assets($1); ?>',
            // ago function
            '#\@ago\((.*?)\)+#iU' => '<?php echo ago($1); ?>',
        ];

        return preg_replace(array_keys($compilers), array_values($compilers), $content);
    }
}