<?php
namespace System\CLI\Commands;

use System\Console;
use System\CLI\Command;

class ProduceApplication extends Command
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

        static::yellow('Building...');

        $this->app->ui->buildApp($appName)->produce();
        
        static::green('Build Completed!');

        static::yellow('Compiling...');

        $this->app->ui->compileForProduction();

        static::green('App has been compiled successfully Completed!');
    }
}
