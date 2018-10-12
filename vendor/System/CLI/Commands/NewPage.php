<?php
namespace System\CLI\Commands;

use stdClass;
use System\CLI\Command;
use Symfony\Component\Filesystem\Filesystem;

class NewPage extends Command
{
    /**
     * Page component path
     * 
     * @var string
     */
    private $pageComponentPath;

    /**
     * Page Class name
     * 
     * @var string
     */
    private $className;

    /**
     * Page name alias
     * 
     * @var string
     */
    private $pageNameAlias;

    /**
     * {@inheritDoc}
     */
    public function execute()
    {
        $pageName = array_shift($this->optionsList);

        if (!$pageName) {
            return static::error('Please write down the page name!');
        }  

        $config = $this->jsonFile('config.json');

        $defaultApp = '';

        foreach ($config->apps as $appName => $app) {
            if ($app->path == '/') {
                $defaultApp = $appName;
                break;
            }
        }

        $appName = $this->flag('app', $defaultApp);

        if (! $appName) {
            return static::error('Please provide app name using the --app=myAppName flag');
        }
        
        $this->pageComponentPath = "ui/apps/{$appName}/components/pages/{$pageName}";

        if (is_dir($this->pageComponentPath)) {
            return static::error(sprintf('%s page already exists!', $pageName));
        }

        static::yellow(sprintf('Creating %s page', $pageName));

        $this->className = implode('', array_map('ucFirst', explode('-', $pageName)));

        $this->pageNameAlias = lcfirst($this->className);
       
        // first we will copy the page component 
        $fs = new FileSystem;

        $fs->mirror('vendor/System/copied/ui-page', $this->pageComponentPath);

        // now we will update all files to replace the placeholder with the page name
        // update js file
        $this->createJsFile($pageName);
        $this->createHtmlFile($pageName);
        $this->createScssFiles($pageName);    

        // rebuild the application again
        if ($this->flag('rebuild') !== 'false') {
            system("php visualize build $appName --silent");
        }

        static::green(sprintf('%s page has been created successfully!', $pageName));
    }

    /**
     * Create the js file
     * 
     * @param  string $pageName
     * @return void
     */
    private function createJsFile(string $pageName)
    {
        $jsFile = file_get_contents($this->pageComponentPath . '/js/Page.js');
              
        $jsFile = str_replace('class placeholder', "class {$this->className}Page", $jsFile);

        $jsFile = str_replace("this.name = 'placeholder';", "this.name = '{$this->pageNameAlias}';", $jsFile);
        $jsFile = str_replace("placeholder", $pageName, $jsFile);

        unlink($this->pageComponentPath . '/js/Page.js');

        file_put_contents($this->pageComponentPath . "/js/{$this->className}Page.js", $jsFile);
    }

    /**
     * Create html file
     * 
     * @param  string $pageName
     * @return void
     */
    private function createHtmlFile(string $pageName)
    {
        $pageContent = $this->flag('content', "<h1 class=\"text-center\">{$pageName} Page</h1>");

        file_put_contents($this->pageComponentPath . '/html/page.html', $pageContent);
    }

    /**
     * Create scss files
     * 
     * @param  string $pageName
     * @return void
     */
    private function createScssFiles(string $pageName)
    {
        foreach (['common', 'ltr', 'rtl'] as $direction) {
            foreach (['desktop', 'mobile'] as $device) {
                $devicePath = "{$this->pageComponentPath}/scss/$direction/$device.scss";

                $deviceContent = file_get_contents($devicePath);
    
                $deviceContent = str_replace('placeholder', $this->pageNameAlias, $deviceContent);

                file_put_contents($devicePath, $deviceContent);
            }
        }
    }
}
