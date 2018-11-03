<?php
namespace System\CLI;

use System\Console;
use System\Application;

class Config
{
    /**
     * Configuration file path
     * 
     * @const string 
     */
    const CONFIG_PATH = 'vendor/System/storage/visualizer/installed';

    /**
     * Available configurations list
     * 
     * @const array
     */
    const AVAILABLE_OPTIONS = [
        'colored',
        'silent',
        'baseApp',
        'openBrowser',
    ];

    /**
     * configurations list
     *
     * @var mixed
     */
    protected static $options;

    /**
     * Create the configuration file
     * 
     * @param  array $options
     * @return void
     */
    public static function create(array $options)
    {
        $configText = '';

        $options = array_merge((array) static::$options, $options);

        foreach ($options as $key => $value) {
            if ($value === false) {
                $value = 'false';
            }

            $value = (string) $value;

            $configText .= "$key=$value" . PHP_EOL;
        }

        file_put_contents(static::CONFIG_PATH, $configText);
    }

    /**
     * Determine if the configuration file is created
     * 
     * @return bool
     */
    public static function exists(): bool
    {
        return file_exists(static::CONFIG_PATH);
    }

    /**
     * Determine if the given option is one of the available configurations
     * 
     * @param  string $optionName 
     * @return bool
     */
    public static function accepts(string $optionName): bool
    {
        return in_array($optionName, static::AVAILABLE_OPTIONS);
    }

    /**
     * Initialize the config class
     *
     * @return void
     */
    public static function init()
    {
        $options = file(static::CONFIG_PATH);

        foreach ($options as $option) {
            list($key, $value) = explode('=', $option);

            $value = trim($value);

            if ($value === 'false') {
                $value = false;
            } elseif ($value === 'true') {
                $value = true;
            }

            static::$options[$key] = $value;
        }
    }

    /**
     * Get the value of the given option name from the framework global configurations
     * 
     * @param  string $option
     * @return mixed
     */
    public static function get(string $option)
    {
        return static::$options[$option] ?? null;
    }
    

    /**
     * Update framework global configuration by setting the given value
     * 
     * @param  string $option
     * @param  mixed $value
     * @return mixed
     */
    public static function set(string $option, $value)
    {
        static::$options[$option] = $value;

        static::create(static::$options);
    }
}