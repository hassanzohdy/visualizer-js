<?php
namespace System\CLI\Commands;

use System\CLI\Command;

class Install extends Command
{
    /**
     * {@inheritDoc}
     */
    public function execute()
    {
        if (file_exists($installedFile = 'vendor/System/storage/visualizer/installed')) {
            die('Framework is already installed!');
        } else {
            if (!function_exists('system')) {
                die("Can't install Visualizer automatically, system function must be enabled");
            } else {
                echo("Installing...\r\n");
                copy('vendor/System/copied/config.json', 'config.json');
                copy('vendor/System/copied/loader.json', 'ui/loader.json');
                mkdir('ui/apps');
                mkdir('vendor/System/storage/visualizer');
                system('composer install');
                touch($installedFile);
                system('php visualize new:app blog --silent --path=/');
            }
        }
    }
}
