<?php
use System\Application;

if (!function_exists('app')) {
    /**
     * Get application object
     *
     * @return \System\Application
     */
    function app()
    {
        return Application::getInstance();
    }
}

if (! function_exists('array_flat')) {
    /**
    * Flatten the given array with a dot
    *
    * @param array $array
    * @param string $prepend
    * @return array
    */
    function array_flat(array $array, $prepend = '.', $root = '', $result = [])
    {
        foreach($array AS $key => $value) {
            if (is_array($value)) {
                 $result = array_merge([$key => $value], array_flat($value, $prepend, $root . $key . $prepend, $result));
            } else {
                $result[$root . $key] = $value;
            }
        }

        return $result;
    }
}
function pred($a) {
    echo '<pre>';
    print_r($a);
    die;
}

if (!function_exists('config')) {
    /**
     * Get value from config
     *
     * @param string $key
     * @return mixed
     */
    function config($key)
    {
        return app()->config($key);
    }
}

if (!function_exists('assets')) {
    /**
     * Generate full path for the given path in public directory
     *
     * @param string $path
     * @return string
     */
    function assets($path)
    {
        return app()->url->link('public/' . $path);
    }
}

if (!function_exists('clang')) {
    /**
     * Get the object of current language
     *
     * @return object
     */
    function clang()
    {
        return app()->language;
    }
}

if (!function_exists('str_remove_end')) {
    /**
     * Remove from the end of given string
     *
     * @param string string
     * @param string $removedString
     * @return string
     */
    function str_remove_end($string, $removedString)
    {
        return mb_substr($string, 0, -1 * mb_strlen($removedString));
    }
}

if (!function_exists('str_remove_start')) {
    /**
     * Remove from the start of given string
     *
     * @param string string
     * @param string $removedString
     * @return string
     */
    function str_remove_start($string, $removedString)
    {
        return mb_substr($string, mb_strlen($removedString));
    }
}

if (!function_exists('array_remove_by_value')) {
    /**
     * Remove from the given array any keys that have the given value
     *
     * @param array $array
     * @param mixed $value
     * @return void
     */
    function array_remove_by_value(array &$array, $value)
    {
        unset($array[array_search($value, $array)]);
    }
}
