<?php
namespace System\CLI\Commands;

use stdClass;
use Symfony\Component\Filesystem\Filesystem;
use System\CLI\Command;

class NewApplication extends Command
{
    /**
     * {@inheritDoc}
     */
    public function execute()
    {
        $appName = array_shift($this->optionsList);

        if (!$appName) {
            return static::error('Please write down the application name!');
        }

        $config = $this->jsonFile('config.json');

        if (isset($config->apps->$appName)) {
            return static::error(sprintf('%s application already exists', $appName));
        }

        static::green('Crafting '. static::inlineBold($appName) .' Application....');

        $this->createAppConfig($appName, $config);

        // now copy the default application structure to that directory
        $fs = new FileSystem;

        $fs->mirror($this->app->file->to('vendor/System/copied/ui-app'), $appPath = $this->app->file->to('src/apps/' . $appName));

        // update config.json file
        $this->putJson('config.json', $config);

        // update the package.json file to add the application name

        $appPackage = $this->jsonFile($appPath . '/package.json');

        $appPackage->name = $appName;

        $this->putJson($appPath . '/package.json', $appPackage);

        // create new empty assets/images directory in the application directory
        mkdir('src/apps/' . $appName . '/assets/images', 0777, true);

        // create default pages
        mkdir('src/apps/' . $appName . '/components/pages', 0777, true);
        
        system('php visualize new:smart-page not-found --route=* --app='. $appName .' --silent --rebuild=false');
        system('php visualize new:smart-page home --route=/ --app='. $appName .' --silent --rebuild=false');
        
        // now build the application
        system("php visualize build $appName --silent");
    }

    /**
     * Create application configurations
     *
     * @param  string $appName
     * @param  object $config
     * @return void
     */
    private function createAppConfig($appName, $config)
    {
        $options = [];

        // --path=/admin
        $path = static::flag('path', "/$appName");
       
        if ($path[0] != '/') {
            $path = "/$path";
        }
            
        // --locale=en
        $defaultLocaleCode = static::flag('locale', 'en');

        // --locales=en,ar,fr
        $locales = explode(',', static::flag('locales', 'en'));

        // --title=en:MyEnAppTitle,MyArAppTitle
        $titles = static::flag('title', "en:$appName");

        $titles = explode(',', $titles);
        $titlesList = [];
        foreach ($titles as $titleWithLocale) {
            list($localeCode, $title) = explode(':', $titleWithLocale);

            $titlesList[$localeCode] = $title;
        }

        $titles = $titlesList;

        $config->apps->$appName = (object) [
            'path' => $path,
            'locale' => $defaultLocaleCode,
            'title' => $titles,
            'locales' => $locales,
        ];

        // make sure the application with the / prefix be at the bottom of the list

        $newAppsList = new stdClass;
        $mainApp = null;
        $mainAppName = null;

        foreach ($config->apps as $appName => $app) {
            if ($app->path != '/') {
                $newAppsList->$appName = $app;
            } else {
                $mainApp = $app;
                $mainAppName = $appName;
            }
        }

        $config->apps = $newAppsList;

        if ($mainAppName) {
            $config->apps->$mainAppName = $mainApp;
        }
    }
}
