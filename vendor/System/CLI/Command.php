<?php
namespace System\CLI;

use System\Console;
use System\Application;

abstract class Command
{
    /**
     * Application object
     *
     * @var \System\Application
     */
    protected $app;

    /**
     * Original Options list
     *
     * @var array
     */
    protected $originalOptionsList = [];

    /**
     * Options list
     *
     * @var array
     */
    protected $optionsList = [];

    /**
     * flags list
     *
     * @var array
     */
    protected static $flags = [];

    /**
     * Constructor
     *
     * @param  array $optionsList
     * @param  \System\Application $app
     */
    public function __construct(array $optionsList, Application $app = null)
    {
        $this->app = $app;
        $this->originalOptionsList = $this->optionsList = $optionsList;

        static::collectFlags($this->optionsList);
    }

    /**
     * Collect options flags if found
     * Any flag MUST start with --
     * i.e --flag=value
     *
     * @return void
     */
    private static function collectFlags(& $optionsList)
    {
        foreach ($optionsList as $key => $option) {
            if (strpos($option, '--') === 0) {
                $optionValue = explode('=', $option);

                $optionName = array_shift($optionValue);

                // this condition is for inline flags like: 
                //--silent that doesn't have a value
                if (! $optionValue) {
                    $optionValue = [true];
                }

                $optionName = str_remove_start($optionName, '--');

                $optionValue = trim(implode('=', $optionValue));

                if ($optionValue === 'false') {
                    $optionValue = false;
                }

                static::$flags[$optionName] = $optionValue;

                // remove the flag from the list 
                unset($optionsList[$key]);
            } 
        }
    }

    /**
     * Ring the bill when the command is done
     * 
     * @return void
     */
    public function done()
    {
        if (! static::flag('silent')) {
            Console::bell();
        }
    }

    /**
     * Get a flag value or return the default given value
     *
     * @param  string $flagName
     * @param  mixed $defaultValue
     * @return mixed
     */
    protected static function flag(string $flagName, $defaultValue = null)
    {
        return static::$flags[$flagName] ?? 
               (Config::get($flagName) ?: $defaultValue);
    }

    /**
     * Get all flags list
     * 
     * @return array
     */
    protected static function flagsList(): array
    {
        return static::$flags;
    }

    /**
     * Get json content from file
     *
     * @param  string $filePath
     * @return mixed
     */
    protected function jsonFile(string $filePath)
    {
        $content = json_decode(file_get_contents($filePath));

        if (!$content) {
            return static::error(sprintf('Invalid json syntax in %s', $filePath));
        }

        return $content;
    }

    /**
     * Put content in json file
     *
     * @param  string $filePath
     * @param  mixed $content
     * @param  mixed $jsonFlags
     * @return void
     */
    protected function putJson(string $filePath, $content, $jsonFlags = JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)
    {
        file_put_contents($filePath, json_encode($content, $jsonFlags));
    }

    /**
     * Display the given message in new line in the given color
     *
     * @param  string $message
     * @return void
     */
    public static function __callStatic($color, $args)
    {   
        if (strpos($color, 'inline') === 0) {
            $color = strtolower(str_remove_start($color, 'inline'));

            if (! static::flag('colored')) {
                return $args[0];
            }

            return Console::$color(...$args);
        }

        $text = static::flag('colored') ? Console::$color(...$args) : $args[0];

        Console::newLine(
            $text
        );
    }
}
