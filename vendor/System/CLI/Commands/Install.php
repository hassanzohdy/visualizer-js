<?php
namespace System\CLI\Commands;

use System\CLI\Config;
use System\CLI\Command;
class Install extends Command
{
    /**
     * {@inheritDoc}
     */
    public function execute()
    {
        if (Config::exists()) {
            return static::error('Framework is already installed!');
        } 
        
        static::yellow("Installing...\r\n");

        @mkdir('src/apps', 0755);
        @mkdir('vendor/System/storage/visualizer', 0755);

        if (! file_exists($configFile = 'vendor/System/copied/config.json')) {
            @copy($configFile, 'config.json');
        }

        if (! file_exists($loaderFile = 'vendor/System/copied/loader.json')) {
            @copy($loaderFile, 'src/loader.json');
        }
        
        system('composer install');

        system('npm install');

        $baseApp = static::flag('app', 'blog');

        $path = static::flag('path', '/');

        $options = [
            'baseApp' => $baseApp,
            'colored' => static::flag('colored', true),
            'silent' => static::flag('silent', false),
            'openBrowser' => static::flag('openBrowser', true),
        ];

        Config::create($options);

        system("php visualize new:app $baseApp --silent --path=$path");    
    }
}
