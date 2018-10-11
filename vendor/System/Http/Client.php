<?php
namespace System\Http;

use Jenssegers\Agent\Agent;
use Jaybizzle\CrawlerDetect\CrawlerDetect;

class Client extends Agent
{
    /**
    * Request Object
    *
    * @var \System\Http\Request
    */
    private $request;

    /**
    * Ip geo details
    *
    * @var array
    */
    private $ipDetails = [];

    /**
    * Set request Object
    *
    * @param \System\Http\Request $request
    * @return $this
    */
    public function setRequest(Request $request)
    {
        $this->request = $request;

        return $this;
    }

    /**
    * Get client ip
    *
    * @return string
    */
    public function ip()
    {
        return $this->request->ip();
    }

    /**
    * Get client country using his ip
    *
    * @return string
    */
    public function country()
    {
        return $this->getIpDetails('country');
    }

    /**
    * Get all ip details or only the given key
    *
    * @param string $key
    * @return mixed
    */
    public function getIpDetails($key = null)
    {
        // if the ip details is null
        // it means we have searched for the ip details before
        // and nothing was found
        if (is_null($this->ipDetails)) return;

        if (! $this->ipDetails) {
            $this->ipDetails = $this->request->getIpDetails($this->ip());
        }

        return $key ? array_get($this->ipDetails, $key) : $this->ipDetails;
    }

    /**
    * Get Country Code
    *
    * @return string
    */
    public function countryCode()
    {
        return $this->getIpDetails('country_code');
    }

    /**
    * Get Currency Symbol
    *
    * @return string
    */
    public function currencySymbol()
    {
        return $this->getIpDetails('currency_symbol');
    }

    /**
    * Get Currency Code
    *
    * @return string
    */
    public function currency()
    {
        return $this->getIpDetails('currency');
    }

    /**
    * Get Currency Value
    *
    * @return string
    */
    public function currencyValue()
    {
        return $this->getIpDetails('currency_value');
    }

    /**
    * Get client user agent
    *
    * @return string
    */
    public function userAgent()
    {
        return $this->request->userAgent();
    }

    /**
    * Get client browser version
    *
    * @return string
    */
    public function browserVersion()
    {
        return $this->version($this->browser());
    }

    /**
    * Get client os version
    *
    * @return string
    */
    public function osVersion()
    {
        return $this->version($this->platform());
    }

    /**
    * Get client languages in browser
    *
    * @return array
    */
    public function languages($acceptedLanguage = null)
    {
        // we will remove any locales that has a - on it
        return array_filter(parent::languages(), function ($language) {
            return strpos($language, '-') === false;
        });
    }

    /**
    * Detect wether the client has the given language locale or not
    *
    * @param string $languageLocale
    * @return bool
    */
    public function hasLanguage($languageLocale)
    {
        return in_array($languageLocale, $this->languages());
    }

    /**
    * Determine if the current device type is mobile or not
    * Please not this is a fix for that the tablet is considered as a mobile
    * so we will make sure it is a mobile and not a tablet
    *
    * @return bool
    */
    public function isMobile($userAgent = null, $httpHeaders = null)
    {
        return parent::isMobile() AND ! $this->isTablet();
    }

    /**
    * Determine whether the current client is a bot
    * This is more accurate to detect various bots
    *
    * @return bool
    */
    public function isBot()
    {
        return (new CrawlerDetect)->isCrawler();
    }
}