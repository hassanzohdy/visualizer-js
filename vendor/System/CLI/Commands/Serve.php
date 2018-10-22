<?php
namespace System\CLI\Commands;

use System\CLI\Config;
use System\CLI\Command;
class Serve extends Command
{
    /**
     * {@inheritDoc}
     */
    public function execute()
    {
        $app = array_pop($this->optionsList) ?: Config::get('baseApp');

        $compilerDir = ROOT . '/vendor/System/CLI/HTMLCompiler';

        $ui = app()->ui->buildApp($app);

        $baseUrl = app()->ui->currentApp->baseUrl;

        $commandsList = [
            'node',
            '"' . $compilerDir .'"',
            '"' . ROOT .'"',
            $app,
            $baseUrl,
        ];

        system(implode(' ', $commandsList));
    }
}
