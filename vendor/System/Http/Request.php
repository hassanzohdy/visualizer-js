<?php
namespace System\Http;

use System\Application;
use Symfony\Component\HttpFoundation\Request AS SymfonyRequest;

class Request
{
    /**
    * Super global _GET data
    *
    * @var array
    */
    public $params = [];

     /**
     * current Url
     *
     * @var string
     */
    protected $url;

     /**
     * Script path
     *
     * @var string
     */
    protected $scriptPath;

     /**
     * Base Url
     *
     * @var string
     */
    protected $baseUrl;

     /**
     * Uploaded Files Container
     *
     * @var array
     */
    protected $files = [];

    /**
    * Client Object
    *
    * @var \System\Http\Client
    */
    protected $client;

    /**
    * Constructor
    *
    * @param \Systems\Application
    */
    public function __construct(Application $app)
    {
        $this->app = $app;
        $this->params = $_GET;
    }

    /**
     * Set the url for current request
     *
     * @param string $url
     * @return void
     */
    public function setUrl($url)
    {
        $this->url = $url;
    }

     /**
     * Prepare url
     *
     * @return void
     */
    public function prepareUrl()
    {
        $script = dirname($this->server('SCRIPT_NAME'));

        if ($script == '.') {
            $script = '/';
        }

        $requestUri = $this->server('REQUEST_URI');

        if (strpos($requestUri, '?') !== false) {
            list($requestUri, $queryString) = explode('?' , $requestUri);
        }

        $this->url = rtrim(preg_replace('#^'.$script.'#', '' , $requestUri), '/');

        // make sure that if the url is empty to make it the default one is /
        if (! $this->url) {
            $this->url = '/';
        }

        $this->scriptPath = $script ?: '/';

        // make sure the url starts with /
        if ($this->url[0] != '/') {
            $this->url = '/' . $this->url;
        }

        $this->url = urldecode($this->url);

        // if the script is the root "it means the script value will be /"
        // then we will make it empty
        // because we're going to add the slash at the end of the base url
        if ($script == '/') {
            $script = '';
        }

        // replace // with one /
        $this->url =  str_replace('//', '/', $this->url);

        $this->baseUrl = $this->domainUrl() . $script . '/';
    }

    /**
    * Get ip details
    *
    * @param string $ip
    * @return array|null
    */
    public function getIpDetails($ip)
    {
        // i need to use this later 'http://ip-api.com/json/156.209.137.113'
        $ipDetails = @file_get_contents('http://geoplugin.net/json.gp?ip=' . $ip);

        if (! $ipDetails) return null;

        $ipDetails = json_decode($ipDetails);

        if ($ipDetails->geoplugin_status != 200) {
            return null;
        }

        return [
            'continent_code'        => $ipDetails->geoplugin_continentCode,
            'country'               => $ipDetails->geoplugin_countryName,
            'country_code'          => $ipDetails->geoplugin_countryCode,
            'city'                  => $ipDetails->geoplugin_city,
            'region'                => $ipDetails->geoplugin_region,
            'currency'              => $ipDetails->geoplugin_currencyCode,
            'currency_symbol'       => $ipDetails->geoplugin_currencySymbol_UTF8,
            'currency_value'        => $ipDetails->geoplugin_currencyConverter,
        ];
    }

    /**
    * Get Client Object
    *
    * @return \System\Http\Client
    */
    public function client()
    {
        if (is_null($this->client)) {
            $this->client = new Client;
            $this->client->setRequest($this);
        }

        return $this->client;
    }

    /**
     * Get http authorization
     * 
     * @return string
     */
    public function authorization()
    {
        return $this->server('HTTP_AUTHORIZATION') ?: $this->server('REDIRECT_HTTP_AUTHORIZATION');
    }

    /**
    * Get domain name without any protocols
    *
    * @return string
    */
    public function domain()
    {
        return $this->server('HTTP_HOST');
    }

    /**
    * Get script path
    *
    * @return string
    */
    public function scriptPath()
    {
        return $this->scriptPath;
    }

    /**
    * Get domain url
    *
    * @return string
    */
    public function domainUrl()
    {
        // if (! $this->domain()) {
            // return $this->app->config('baseUrl');
        // }

        $scheme = $this->server('HTTP_X_FORWARDED_PROTO') ?: $this->getScheme();
        return $scheme . '://' . $this->domain();
    }

    /**
    * Get request scheme
    *
    * @return string
    */
    public function getScheme()
    {
        return $this->isSecure() ? 'https' : 'http';
    }

    /**
     * Checks whether the request is secure or not.
     *
     * @return bool
     */
    public function isSecure()
    {
        $https = $this->server('HTTPS');

        return !empty($https) && strtolower($https) !== 'off';
    }

    /**
    * Get User agent
    *
    * @return string
    */
    public function userAgent()
    {
        return $this->server('HTTP_USER_AGENT');
    }

     /**
     * Get Value from _GET by the given key
     *
     * @param string $key
     * @param mixed $default
     * @return mixed
     */
    public function get($key, $default = null)
    {
        $value = $this->getInput($_GET, $key, $default);

        return is_array($value) ? array_unique($value, SORT_REGULAR) : $value;
    }

     /**
     * Get Value from _POST by the given key
     *
     * @param string $key
     * @param mixed $default
     * @return mixed
     */
    public function post($key, $default = null)
    {
        $value = $this->getInput($_POST, $key, $default);

        return $value;

        return is_array($value) ? array_unique($value, SORT_REGULAR) : $value;
    }

    /**
    * Flatten the given key and get it from the global variable
    * if not found, return the default
    *
    * @param array array
    * @param string $key
    * @param mixed $default
    * @return mixed
    */
    private function getInput($array, $key, $default)
    {
        // first flatten the array
        //$array = array_flat($array);

        if (strpos($key, '.') !== false) {
            $keys = explode('.', $key);

            while ($keys) {
                $gottenKey = array_shift($keys);
                // just remove any white space if there is a value
                $array = array_get($array, $gottenKey, $default);
                if (! $keys) {
                    $value = $array;
                }
            }
        } else {
            $value = array_get($array, $key, $default);
        }

        if (! is_array($value)) {
            $value = trim($value);
        }

        return $value;
    }

    /**
    * Get current visitor ip
    *
    * @return string
    */
    public function ip()
    {
        // we will get it from symfony
        $ip = SymfonyRequest::createFromGlobals()->getClientIp();

        if ($ip == '::1') {
            $ip = '127.0.0.1';
        }

        return $ip;
    }

     /**
     * Set Value To _GET For the given key
     *
     * @param string $key
     * @param mixed $valuet
     * @return mixed
     */
    public function setGet($key, $value)
    {
        $_GET[$key] = $value;
    }

     /**
     * Set Value To _POST For the given key
     *
     * @param string $key
     * @param mixed $valuet
     * @return mixed
     */
    public function setPost($key, $value)
    {
        $_POST[$key] = $value;
    }

     /**
     * Get the uploaded file object for the given input
     *
     * @param string $input
     * @return \System\Http\UploadedFile
     */
    public function file($input)
    {
        if (isset($this->files[$input])) {
            return $this->files[$input];
        }

        $uploadedFile = new UploadedFile($input);

        $this->files[$input] = $uploadedFile;

        return $this->files[$input];
    }

     /**
     * Get Value from _SERVER by the given key
     *
     * @param string $key
     * @param mixed $default
     * @return mixed
     */
    public function server($key, $default = null)
    {
        return array_get($_SERVER, $key, $default);
    }

     /**
     * Get Current Request Method
     *
     * @return string
     */
    public function method()
    {
        return $this->server('REQUEST_METHOD');
    }

     /**
     * Get The referer link
     *
     * @return string
     */
    public function referer()
    {
        return $this->server('HTTP_REFERER');
    }

    /**
    * determine wether the request is coming through xmlhttprequest
    *
    * @return bool
    */
    public function isAjax()
    {
        return strtolower($this->server('HTTP_X_REQUESTED_WITH')) == 'xmlhttprequest';
    }

     /**
     * Get full url of the script
     *
     * @return string
     */
    public function baseUrl()
    {
        return $this->baseUrl;
    }

     /**
     * Get Only relative url (clean url)
     *
     * @return string
     */
    public function url()
    {
        return $this->url;
    }

    /**
    * Get the full url of current request
    *
    * @param bool $appendQueryString
    * @return string
    */
    public function fullUrl($appendQueryString = false)
    {
        $url = $this->baseUrl . ltrim($this->url, '/');

        if ($appendQueryString === true AND ($queryString = $this->flattenQuery())) {
            $url .= '?' . $queryString;
        }

        return $url;
    }

    /**
    * Get the current url in with https instead of http
    *
    * @return string
    */
    public function httpsUrl()
    {                                 
        return rtrim('https://' . $this->domain() . $this->scriptPath()  . ltrim($this->url), '/');
    }

    /**
    * Get clean query string and remove any duplicated parameters
    * if the parameters variable is present
    * then we ill flatten it
    * otherwise, flatten the query string it self
    * @param array $parameters
    * @return string
    */
    public function flattenQuery(array $parameters = [])
    {
        $parameters = $parameters ?: $this->params;

        return http_build_query($parameters);
    }
}