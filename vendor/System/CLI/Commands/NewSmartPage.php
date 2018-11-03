<?php
namespace System\CLI\Commands;

class NewSmartPage extends NewPage
{
    /**
     * Layout class
     * 
     * @var string
     */
    protected $layoutClass = 'Smart';

    /**
     * Html directory
     * 
     * @var string
     */
    protected $htmlDirectory = 'smart-views';
}
