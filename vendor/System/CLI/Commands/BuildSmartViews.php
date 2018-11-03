<?php
namespace System\CLI\Commands;

use System\Console;
use System\CLI\Config;
use System\CLI\Command;

class BuildSmartViews extends Command
{
    /**
     * {@inheritDoc}
     */
    public function execute()
    {
        $appName = $this->optionsList ? array_pop($this->optionsList) : Config::get('baseApp');

        if (!$appName) {
            return static::error('Please write down the application name!');
        }
        
        static::yellow('Building...');

        $command = [
            'node',
            ROOT . '/vendor/System/CLI/HTMLCompiler/buildSmartViews.js',
            ROOT,
            $appName,
        ];

        system(implode(' ', $command));
        
        static::green('Smart views have been built successfully!');
    }

    /**
     * Build the given application name
     * 
     * @param  string $appName
     * @return  void
     */
    public static function build(string $appName)
    {
        app()->ui->buildApp($appName)->env('development')->forceRebuild(true)->run();
    }
}
