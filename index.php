<?php

$_GET['s'] = microtime(true);
   
require __DIR__ . '/vendor/autoload.php';

use System\File;
use System\Application;

$file = new File(__DIR__);

$app = Application::getInstance($file);

$app->run();