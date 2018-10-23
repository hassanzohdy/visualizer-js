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

        mkdir('ui/apps');
        mkdir('vendor/System/storage/visualizer');
        copy('vendor/System/copied/config.json', 'config.json');
        copy('vendor/System/copied/loader.json', 'ui/loader.json');

        system('composer install');

        system('npm install');

        $baseApp = static::flag('app', 'blog');

        $path = static::flag('path', '/');

        $options = [
            'baseApp' => $baseApp,
            'colored' => static::flag('colored', true),
            'silent' => static::flag('silent', false),
        ];

        Config::create($options);

        system("php visualize new:app $baseApp --silent --path=$path");    
    }
}
