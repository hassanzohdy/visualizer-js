<?php
namespace System;

use Exception;
use Illuminate\Support\Str;
use Leafo\ScssPhp\Compiler;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Finder\Finder;

class UIManager
{
    /**
     * Loader data
     *
     * @var object
     */
    private $loader;

    /**
     * src directory
     *
     * @var string
     */
    private $srcDir;

    /**
     * Static path to store files
     *
     * @var string
     */
    private $staticDir;

    /**
     * Vendors
     *
     * @var array
     */
    private $vendors = [];

    /**
     * Assets
     *
     * @var array
     */
    private $assets = [];

    /**
     * Components
     *
     * @var array
     */
    private $components = [];

    /**
     * Application object
     *
     * @var \System\Application
     */
    private $app;

    /**
     * Application Config info
     *
     * @var object
     */
    public $currentApp;

    /**
     * Style sheets urls list
     *
     * @var array
     */
    private $stylesheets = [];

    /**
     * Javascript urls list
     *
     * @var array
     */
    private $scripts = [];

    /**
     * config.json info
     *
     * @var array
     */
    private $config = [];

    /**
     * Framework name
     *
     * @var string
     */
    private $framework = 'visualizer';

    /**
     * Environment mode
     *
     * @var string
     */
    private $env;

    /**
     * If set to true then the application will be rebuilt again
     *
     * @var bool
     */
    private $forceRebuild = false;

    /**
     * All resources list
     *
     * @var array
     */
    private $resources = [
        'vendor' => [
            'js' => [],
            'css' => [
                'common' => [],
                'ltr' => [],
                'rtl' => [],
            ],
        ],
        "externals" => [
            'js' => [],
            'css' => [
                'common' => [],
                'ltr' => [],
                'rtl' => [],
            ],
        ],
        'components' => [
            'js' => [],
            'scss' => [],
        ],
        'assets' => [],
    ];

    /**
     * Constructor
     *
     * @param \System\Application $app
     */
    public function __construct(Application $app)
    {
        $this->app = $app;

        $this->config = json_decode($app->file->content('config.json'));

        if (!$this->config) {
            throw new Exception('Invalid syntax for config.json file');
        }
    }

    /**
     * Set environment mode
     *
     * @param string $env
     * @return $this
     */
    public function env($env)
    {
        $this->env = $env;

        return $this;
    }

    /**
     * Force rebuild application
     *
     * @param bool $forceRebuild
     * @return $this
     */
    public function forceRebuild($forceRebuild)
    {
        $this->forceRebuild = $forceRebuild;

        // remove the app directory first
        $appDir = 'public/static/' . $this->currentApp->name;

        if (is_dir('public/static/' . $this->currentApp->name)) {
            $fs = new FileSystem;

            try {
                $fs->remove($appDir);
            } catch (Exception $e) {
                $fs->remove($appDir);
            }

            // @(new FileSystem)->remove('public/static/' . $this->currentApp->name . '/js');
        }

        @mkdir($appDir . '/smart-views', 0777, true);

        return $this;
    }

    /**
     * Prepare app configurations
     *
     * @return void
     */
    private function init()
    {
        if (!$this->currentApp) {
            $route = $this->app->request->url();

            foreach ($this->config->apps as $appName => $app) {
                if (strpos($route, $app->path) === 0) {

                    $locale = $app->locale;
                    $uri = $this->app->request->url();

                    if ($uri == $app->path) {
                        $this->app->url->redirectTo($uri . '/' . $locale);
                    } else {
                        // check if the
                        $uriWithoutAppPath = str_replace_first($app->path, '', $uri);
                        $uriWithoutAppPath = array_values(array_filter(explode('/', $uriWithoutAppPath)));

                        if (!in_array($uriWithoutAppPath[0], $app->locales)) {
                            $this->app->url->redirectTo($app->path . '/' . $app->locale . '/' . implode('/', $uriWithoutAppPath));
                        } else {
                            $locale = $uriWithoutAppPath[0];
                        }
                    }

                    $app->locale = $locale;

                    $language = $this->config->locales->{$app->locale};

                    $this->buildApp($appName);

                    break;
                }
            }
        }
    }

    /**
     * Build the given application name
     *
     * @param string $appName
     * @return void
     */
    public function buildApp($appName)
    {
        if (!isset($this->config->apps->$appName)) {
            throw new Exception(sprintf('Call to undefined application %s', $appName));
        }

        $app = $this->config->apps->$appName;

        $language = $this->config->locales->{$app->locale};

        $language->code = $app->locale;

        $this->app->share('language', $language);

        $app->name = $appName;

        $this->currentApp = $app;

        $localeCode = $this->currentApp->locale;

        $this->currentApp->direction = $this->config->locales->{$localeCode}->direction;
        $this->currentApp->env = $this->currentApp->env ?? $this->config->env;
        $this->currentApp->baseUrl = $this->currentApp->baseUrl ?? $this->config->baseUrl;
        $this->currentApp->locale = $this->currentApp->locale ?? $this->config->locale ?? 'en';

        if (!in_array($localeCode, $this->currentApp->locales)) {
            $this->app->url->redirectTo("/{$this->currentApp->locale}");
        }

        $this->env = $this->currentApp->env ?? $this->config->env;

        if (is_object($this->currentApp->baseUrl)) {
            $this->currentApp->baseUrl = $this->currentApp->baseUrl->{$this->env};
        }

        return $this;
    }

    /**
     * Set app name
     *
     * @param string $appName
     * @return $this
     */
    public function setAppName($appName)
    {
        $this->currentApp->name = $appName;

        return $this;
    }

    /**
     * Set app direction
     *
     * @param string $direction
     * @return $this
     */
    public function setAppDirection($direction)
    {
        $this->currentApp->direction = $direction;

        return $this;
    }

    /**
     * Get stylesheets
     *
     * @return string
     */
    public function stylesheets()
    {
        $tags = '';

        foreach ($this->stylesheets as $stylesheet) {
            $tags .= '<link rel="stylesheet" id="' . (strpos($stylesheet, 'app') !== false ? 'app-style' : '') . '" dir="' . $this->currentApp->direction . '" href="' . $stylesheet . '"/>';
        }

        // for full list of favicons tags please visit the following link
        // https://stackoverflow.com/a/43154399
        if (!empty($this->resources['favicon'])) {
            $favicon = assets("static/{$this->currentApp->name}/{$this->resources['favicon']}");
            $tags .= '<link rel="icon" href="' . $favicon . '"/>';
            $tags .= '<link rel="apple-touch-icon" href="' . $favicon . '"/>';
        }

        return $tags;
    }

    /**
     * Get scripts
     *
     * @return string
     */
    public function scripts()
    {
        $tags = '';

        if ($this->env == 'development') {
            $this->scripts = array_map(function ($script) {
                return $script . '?v=' . filemtime($this->app->file->to($script));
            }, $this->scripts);
        }

        foreach ($this->scripts as $script) {
            $tags .= '<script src="' . trim($script, '/') . '"></script>';
        }

        return $tags;
    }

    /**
     * Produce application
     *
     * @return this
     */
    public function produce()
    {
        $this->forceRebuild(true);

        $this->init();

        $this->srcDir = $this->app->file->to('src') . '/';

        $this->staticDir = $this->app->file->toPublic('static') . '/' . $this->currentApp->name . '/';

        if (!is_dir($this->staticDir)) {
            mkdir($this->staticDir, 0777, true);
        }

        $this->env = 'production';

        $this->build();
        $this->buildSmartViews();
        $this->compileScss();
        $this->renderHtmlViews();
    }

    /**
     * Build smart views
     * 
     * @return void
     */
    protected function buildSmartViews()
    {        
        exec('php visualize build:smartViews');
    }

    /**
     * Start the application
     *
     * @return mixed
     */
    public function run()
    {
        $this->init();

        if ($this->env == 'production') {
            return $this->runInProductionMode();
        } else {
            return $this->runInDevelopmentMode();
        }
    }

    /**
     * Prepare the whole ui app for production
     *
     * @return void
     */
    private function runInProductionMode()
    {
        $appName = $this->currentApp->name;
        $localeCode = $this->currentApp->locale;
        $direction = $this->config->locales->$localeCode->direction;
        return file_get_contents("vendor/System/storage/visualizer/$appName-$localeCode-$direction.html");
        $loaderFile = json_decode(file_get_contents("vendor/System/storage/visualizer/{$this->currentApp->name}-{$this->currentApp->direction}.min.json"));

        $this->resources = (array) $loaderFile;

        $this->stylesheets = array_map(function ($file) {
            return assets($file);
        }, $loaderFile->stylesheets);

        $this->scripts = array_map(function ($file) {
            return assets($file);
        }, $loaderFile->scripts);

        return $this->app->view->render('vendor/System/ui-html/development', [
            'title' => $this->currentApp->title->{clang()->code},
            'stylesheets' => $this->stylesheets(),
            'scripts' => $this->scripts(),
            'appName' => $this->currentApp->name,
            'appPath' => $this->currentApp->path,
        ]);
    }

    /**
     * Run the application for the development mode
     *
     * @return void
     */
    private function runInDevelopmentMode()
    {
        $this->srcDir = $this->app->file->to('src') . '/';

        $this->staticDir = $this->app->file->toPublic('static') . '/' . $this->currentApp->name . '/';

        if (!is_dir($this->staticDir)) {
            mkdir($this->staticDir, 0777, true);
        }

        $cachedLoaderFile = $this->app->file->to('vendor/System/storage/' . $this->framework . '/' . $this->currentApp->name . '.json');

        if (!file_exists($cachedLoaderFile) or $this->forceRebuild) {
            $this->build();
        } else {
            $this->resources = json_decode(file_get_contents($cachedLoaderFile), true);
        }

        $this->compileScss();

        $this->renderHtmlViews();

        $this->stylesheets = [
            assets("static/{$this->currentApp->name}/css/vendor.css?v=" . time()),
            assets("static/{$this->currentApp->name}/css/app-" . $this->currentApp->direction . ".css?v=" . time()),
        ];

        $this->scripts = array_unique(array_merge($this->resources['jsVendor'], $this->resources['jsFiles']));

        $this->collectSmartViews();

        return $this->app->view->render('vendor/System/ui-html/development', [
            'title' => $this->currentApp->title->{clang()->code},
            'stylesheets' => $this->stylesheets(),
            'scripts' => $this->scripts(),
            'appName' => $this->currentApp->name,
            'appPath' => $this->currentApp->path,
        ]);
    }

    /**
     * Minify css
     *
     * @return void
     */
    public function minifyCss()
    {
        // get the stylesheets first
        // first we need to check if the files exist or not
        $stylesheets = ['vendor', 'app-' . $this->currentApp->direction];

        foreach ($stylesheets as $stylesheet) {
            $stylesheetFullPath = $this->staticDir . 'css/' . $stylesheet . '.min.css';

            if (!file_exists($stylesheetFullPath)) {
                // now we will check if the development file exists or not
                // if it doesn't exists, then create it
                if (!file_exists($developmentFile = $this->staticDir . 'css/' . $stylesheet . '.css')) {
                    $this->generate();
                }

                // get the content for the development file and compress it and add it to the minified version of the file
                file_put_contents($stylesheetFullPath, $this->app->html->compressCSS(file_get_contents($developmentFile)));
            }
        }
    }

    /**
     * Compile for production
     *
     * @return void
     */
    public function compileForProduction()
    {
        $this->hash = sha1(time() . mt_rand());

        // now compile css
        $this->compileCss();

        $this->compileJs();

        // now we will generate cached views
        // for each locale

        $baseUrl = $this->config->baseUrl;

        if (is_object($baseUrl)) {
            $baseUrl = $this->config->baseUrl->production;
        }

        $baseUrl = trim($baseUrl, '/');

        $basePath = trim($baseUrl . $this->currentApp->path, '/');

        $staticPath = "{$baseUrl}/public/static/{$this->currentApp->name}";

        $appName = $this->currentApp->name;

        foreach ($this->currentApp->title as $localeCode => $title) {
            $direction = $this->config->locales->$localeCode->direction;
            $stylesheets = [
                "$staticPath/css/vendor-{$this->hash}.min.css",
                "$staticPath/css/app-{$direction}-{$this->hash}.min.css",
            ];

            $favicon = $this->resources['favicon'] ? $staticPath . '/' . $this->resources['favicon'] : '';

            $scripts = [];

            foreach ($this->scripts as $esVersion => $scriptsList) {
                foreach ($scriptsList as $script) {
                    $scripts[$esVersion][] = $baseUrl . '/public/' . $script;
                }
            }

            // $scripts = json_encode($scripts, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

            $outputView = $this->app->view->render('vendor/System/ui-html/production', [
                'title' => $title,
                'stylesheets' => $stylesheets,
                'scripts' => $scripts,
                'appName' => $appName,
                'direction' => $direction,
                'localeCode' => $localeCode,
                'favicon' => $favicon,
                'basePath' => $basePath,
            ]);

            file_put_contents("vendor/System/storage/visualizer/$appName-$localeCode-$direction.html", $outputView);
        }
    }

    /**
     * Compile css for production
     *
     * @return void
     */
    private function compileCss()
    {
        foreach (['ltr', 'rtl'] as $direction) {
            $this->stylesheets = [
                "static/{$this->currentApp->name}/css/vendor-$this->hash.min.css",
                "static/{$this->currentApp->name}/css/app-$direction-$this->hash.min.css",
            ];

            file_put_contents("vendor/System/storage/visualizer/{$this->currentApp->name}-{$direction}.min.json", json_encode([
                'stylesheets' => $this->stylesheets,
                'scripts' => $this->scripts,
                'favicon' => $this->resources['favicon'] ?? '',
            ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
        }

        $this->compileScss('ltr');
        $this->compileScss('rtl');

        // minify content for both files
        $vendorFile = file_get_contents($this->staticDir . 'css/vendor.css');
        $ltrFile = file_get_contents($this->staticDir . 'css/app-ltr.css');
        $rtlFile = file_get_contents($this->staticDir . 'css/app-rtl.css');

        file_put_contents($this->staticDir . "css/vendor-$this->hash.min.css", $this->app->html->compressCss($vendorFile));
        file_put_contents($this->staticDir . "css/app-ltr-$this->hash.min.css", $this->app->html->compressCss($ltrFile));
        file_put_contents($this->staticDir . "css/app-rtl-$this->hash.min.css", $this->app->html->compressCss($rtlFile));
    }

    /**
     * Compile javascript files
     *
     * @return void
     */
    private function compileJs()
    {
        set_time_limit(0);

        return $this->babelCompiler();

        $js = '';

        foreach ($this->resources['jsVendor'] as $jsPath) {
            $js .= file_get_contents(ltrim($jsPath, '/')) . ';' . PHP_EOL;
        }

        mkdir('public/static/' . $this->currentApp->name . '/js-builds', 0777, true);

        file_put_contents('public/static/' . $this->currentApp->name . '/js-builds/vendor.js', $js);

        $compiledVendorJs = $this->compileJsCode($js);

        if (empty($compiledVendorJs->code)) {
            pred($compiledVendorJs);
        }

        $vendorPath = 'static/' . $this->currentApp->name . '/js/vendor-' . $this->hash . '.min.js';

        file_put_contents('public/' . $vendorPath, $compiledVendorJs->code);

        $js = '';

        foreach ($this->resources['jsFiles'] as $jsPath) {
            $js .= file_get_contents(ltrim($jsPath, '/')) . ';' . PHP_EOL;
        }

        file_put_contents('public/static/' . $this->currentApp->name . '/js-builds/app.js', $js);

        $compiledAppJs = $this->compileJsCode($js);

        if (empty($compiledAppJs->code)) {
            pred($compiledAppJs);
        }

        $appPath = 'static/' . $this->currentApp->name . '/js/app-' . $this->hash . '.min.js';

        file_put_contents('public/' . $appPath, $compiledAppJs->code);

        $this->scripts = [
            $vendorPath,
            $appPath,
        ];
    }

    /**
     * Compile code using babel
     *
     * @return void
     */
    private function babelCompiler()
    {
        mkdir($jsBuildsDir = 'public/static/' . $this->currentApp->name . '/js-builds', 0777);

        $this->scripts = [
            'es5' => [],
            'es6' => [],
        ];

        // vendor
        $js = '';

        $es6Signature = substr(sha1(mt_rand()), 0, 6) . '-';

        foreach ($this->resources['jsVendor'] as $jsPath) {
            $js .= file_get_contents(ltrim($jsPath, '/')) . ';' . PHP_EOL;
        }

        $inputFile = $this->app->file->toPublic('static/' . $this->currentApp->name . '/js-builds/vendor.js');

        file_put_contents($inputFile, $js);

        $es5VendorPath = 'static/' . $this->currentApp->name . '/js/vendor-' . $this->hash . '.min.js';
        $es6VendorPath = 'static/' . $this->currentApp->name . '/js/vendor-' . $es6Signature . $this->hash . '.min.js';

        $es5VendorOutputFile = $this->app->file->toPublic($es5VendorPath);
        $es6VendorOutputFile = $this->app->file->toPublic($es6VendorPath);

        // es6
        exec("{$this->app->file->to('node_modules/.bin')}/minify $inputFile --mangle=false --removeConsole=true --out-file $es6VendorOutputFile");

        // es5
        exec("{$this->app->file->to('node_modules/.bin')}/babel $inputFile --out-file $es5VendorOutputFile");

        // app + framework
        $js = '';

        foreach ($this->resources['jsFiles'] as $jsPath) {
            $js .= file_get_contents(ltrim($jsPath, '/')) . ';' . PHP_EOL;
        }

        // smart-views files
        
        $smartViewsFinder = new Finder;

        foreach ($smartViewsFinder->in($this->app->file->toPublic('static/' . $this->currentApp->name . '/smart-views'))->files() as $file) {
            $js .= file_get_contents($file->getRealPath()) . ';' . PHP_EOL;
        }

        $inputFile = $this->app->file->toPublic('static/' . $this->currentApp->name . '/js-builds/app.js');

        file_put_contents($inputFile, $js);

        $es5AppPath = 'static/' . $this->currentApp->name . '/js/app-' . $this->hash . '.min.js';
        $es6AppPath = 'static/' . $this->currentApp->name . '/js/app-' . $es6Signature . $this->hash . '.min.js';

        $es5OutputFile = $this->app->file->toPublic($es5AppPath);
        $es6OutputFile = $this->app->file->toPublic($es6AppPath);

        // es6
        exec("{$this->app->file->to('node_modules/.bin')}/minify $inputFile --mangle=false --removeConsole=true --out-file $es6OutputFile");

        // es5
        exec($this->app->file->to('node_modules/.bin/babel') . " $inputFile --out-file $es5OutputFile --presets env --mangle=false --removeConsole=true");
        // es6
        // $esShim = file_get_contents($this->app->file->to('node_modules/es6-shim/es6-shim.min.js'));
        // es7
        // $esShim .= file_get_contents($this->app->file->to('node_modules/es7-shim/dist/es7-shim.min.js'));

        // babel polyfill
        $esShim = file_get_contents('https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/7.0.0-rc.4/polyfill.min.js');

        // proxy
        $esShim .= file_get_contents($this->app->file->to('node_modules/proxy-polyfill/proxy.min.js'));

        $jsCode = $esShim . file_get_contents($es5OutputFile);

        file_put_contents($es5OutputFile, $jsCode);

        $this->scripts['es5'] = [
            $es5VendorPath,
            $es5AppPath,
        ];

        $this->scripts['es6'] = [
            $es6VendorPath,
            $es6AppPath,
        ];

        // (new FileSystem)->remove($jsBuildsDir);
    }

    /**
     * Compile js code
     *
     * @param string $js
     * @return string
     */
    private function compileJsCode($js)
    {
        $url = 'http://mail.hasanzohdy.com/js-compiler';

        $options = [
            'code' => $js,
            'renaming' => false,
            'version' => 'es5',
        ];

        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($options));
        curl_setopt($ch, CURLOPT_POSTREDIR, 3);

        set_time_limit(0);
        file_put_contents('code.js', $js);

        $minified = curl_exec($ch);

        // finally, close the request
        curl_close($ch);

        return json_decode($minified);
    }

    /**
     * Generate files
     *
     * @return void
     */
    private function build()
    {
        $this->loadLoader();

        $this->collectPackages();

        $this->saveVendors();

        $this->copyAssets();

        $this->saveComponents();

        file_put_contents($this->app->file->to('vendor/System/storage/' . $this->framework . '/' . $this->currentApp->name . '.json'), json_encode($this->resources, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
    }

    /**
     * Load The loader
     *
     * @return void
     * @throws Exception
     */
    private function loadLoader()
    {
        if (!$this->exists('loader.json')) {
            throw new Exception(sprintf('Loader.json file does not exist in src directory'));
        }

        $this->loader = $this->load('loader.json');

        if (!$this->exists($currentAppPackagePath = 'apps/' . $this->currentApp->name . '/package.json')) {
            throw new Exception(sprintf('Missing package.json file for %s application in %s', $this->currentApp->name, $currentAppPackagePath));
        }

        $this->loader->app = $this->load($currentAppPackagePath);
    }

    /**
     * Collect all packages
     *
     * @return void
     */
    private function collectPackages()
    {
        $packages = collect((array) ($this->loader->dependencies ?? []));
        $plugins = collect((array) ($this->loader->plugins ?? []));

        $packages = $packages->unique()->filter();
        $plugins = $plugins->unique()->filter();

        foreach ($packages as $package) {
            $this->loadPackage($package);
        }

        foreach ($plugins as $plugin) {
            $this->loadPackage($plugin, 'plugin');
        }

        $this->loadPackage($this->currentApp->name, 'app');
    }

    /**
     * Load the given package
     *
     * @param string $packageName
     * @param string $packageType
     * @return void
     */
    private function loadPackage(string $packageName, string $packageType = 'framework')
    {
        if (!empty($this->resources['packages'][$packageType . '@' . $packageName])) {
            return;
        }

        if ($packageType == 'framework') {
            $packagePath = $this->framework . '/' . $packageName;
        } elseif ($packageType == 'plugin') {
            $packagePath = 'plugins/' . $packageName;
        } elseif ($packageType == 'app') {
            $packagePath = 'apps/' . $this->currentApp->name;
        }

        if (!$this->exists($packagePath . '/package.json')) {
            throw new Exception(sprintf('Missing package.json file for "%s" package "%s"', $packageType, $packageName));
        }

        $package = $this->load($packagePath . '/package.json');

        $package->path = $packagePath;

        if (empty($package->type)) {
            $package->type = $packageType;
        }

        if (!empty($package->dependencies)) {
            foreach ($package->dependencies as $dependency) {
                $dependencyType = 'framework';
                if (strpos($dependency, '@plugins/')) {
                    $dependencyType = 'plugin';
                    $dependency = str_replace('@plugins/', '', $dependency);
                }

                $this->loadPackage($dependency, $dependencyType);
            }
        }

        if (!empty($package->components)) {
            if ($package->type != 'app') {
                foreach ($package->components as $subPackage) {
                    $this->loadPackage($subPackage, $package->type);
                }
            }
        }

        if (!empty($package->plugins)) {
            foreach ($package->plugins as $plugin) {
                $this->loadPackage($plugin, 'plugin');
            }
        }

        if ($package->type != 'app') {
            $this->resources['packages'][$packageType . '@' . $packageName] = $package->path;
        } else {
            $package->components = array_merge($package->components, [
                'layout/common',
                'layout/layout',
                'pages',
            ]);
            foreach ($package->components as $appComponent) {
                $this->resources['packages']["app@$appComponent"] = "apps/{$this->currentApp->name}/components/$appComponent";
            }
        }

        $this->collectVendors($package);
        $this->collectExternals($package);

        if (!empty($package->assets)) {
            $this->collectAssets($package->assets, $package->path . '/assets');
        }
    }

    /**
     * Collect all assets
     *
     * @param array $assets
     * @param string $assetPath
     * @return void
     */
    private function collectAssets($assets, $assetPath)
    {
        // $assetPath = $this->path($assetPath);

        foreach ($assets as $asset) {
            if (is_string($asset)) {
                $asset = (object) [
                    'dist' => $asset,
                    'src' => $asset,
                ];
            }

            if (empty($asset->src) or empty($asset->dist)) {
                throw new Exception(sprintf('Assets object must have "src" and "dist" keys'));
            }

            // Developer may add one or more source for one dist
            $asset->src = array_map(function ($src) use ($assetPath) {
                return $assetPath . '/' . $src;
            }, (array) $asset->src);

            $this->resources['assets'][] = $asset;
        }
    }

    /**
     * Collect all vendors files for both js and css
     *
     * @param object $package
     * @return void
     */
    private function collectVendors($package)
    {
        if (empty($package->vendor)) {
            return;
        }

        if (!empty($package->vendor->assets)) {
            $assets = $package->vendor->assets;
            $this->collectAssets($assets, 'vendor');
            unset($package->vendor->assets);
        }

        $this->resources['vendor'] = array_merge_recursive($this->resources['vendor'], (array) $package->vendor);
    }

    /**
     * Collect all collectExternals
     *
     * @param object $package
     * @return void
     */
    private function collectExternals($package)
    {
        if (empty($package->externals)) {
            return;
        }

        $this->resources['externals'] = array_merge_recursive($this->resources['externals'], (array) $package->externals);
    }

    /**
     * Save vendors files
     *
     * @return void
     */
    private function saveVendors()
    {
        // first we need to filter css files
        // so we will append the rtl/ltr files to the common css files
        $vendors['js'] = (array) array_get($this->resources['vendor'], 'js');

        $vendorsCss = (array) array_get($this->resources['vendor'], 'css');

        $vendors['css'] = array_get($vendorsCss, 'common');

        if (!empty($vendorsCss[$this->currentApp->direction])) {
            $vendors['css'] = array_merge($vendors['css'], $this->vendors['css'][$this->currentApp->direction]);
        }

        $this->resources['jsVendor'] = [];

        foreach ($vendors as $vendorType => $vendorsList) {
            $vendorContent = '';

            foreach (array_unique((array) $vendorsList) as $vendor) {
                // if the vendor is a url
                // then we will get its content directly
                // otherwise, we will specify a full url for it
                if (filter_var($vendor, FILTER_VALIDATE_URL)) {
                    if ($vendorType == 'js') {
                        $this->resources['jsVendor'][] = $vendor;
                    } else {
                        $vendorContent .= file_get_contents($vendor) . PHP_EOL;
                    }
                } else {
                    if ($vendorType == 'js') {
                        $p = $this->app->file->to('src/vendor/' . $vendor);
                        if (!file_exists($p)) {
                            throw new Exception('Not Found Vendor: ' . $vendor);
                        }

                        $this->resources['jsVendor'][] = '/src/vendor/' . $vendor;
                    } else {
                        $vendorContent .= file_get_contents($this->srcDir . 'vendor/' . $vendor) . PHP_EOL;
                    }
                }
            }

            if (!is_dir($this->staticDir . $vendorType)) {
                @mkdir($this->staticDir . $vendorType, 0777, true);
            }

            // save the vendor code
            file_put_contents($this->staticDir . "$vendorType/vendor.$vendorType", $vendorContent);
        }
    }

    /**
     * Copy all assets
     *
     * @return void
     */
    private function copyAssets()
    {
        $fileSystem = new Filesystem;

        foreach ($this->resources['assets'] as $assets) {
            $dist = $assets->dist;

            foreach ($assets->src as $asset) {
                $assetPath = $this->path($asset);

                if (!is_dir($assetPath)) {
                    throw new Exception(sprintf('%s asset doesn\'t exists', $asset));
                }

                $fileSystem->mirror($assetPath, $this->staticDir . $dist);
            }
        }

        // move favicons if found
        if (!empty($this->loader->app->favicon)) {
            $this->resources['favicon'] = $this->loader->app->favicon;

            if (is_string($this->resources['favicon'])) {
                $favicon = $this->resources['favicon'];
                $from = $this->srcDir . "apps/{$this->currentApp->name}/assets/$favicon";

                if (!is_file($from)) {
                    $to = $this->staticDir . 'assets/' . $favicon;
                    $fileSystem->mirror($from, $to);
                }
            }
        }
    }

    /**
     * Save components
     *
     * @return void
     */
    private function saveComponents()
    {
        $jsComponentsContent = '';
        $jsFinder = new Finder;

        // now we will register the script configurations
        // env, appName base url, script path
        $config = implode(',', [
            $this->env,
            $this->currentApp->name,
            $this->currentApp->baseUrl,
            $this->currentApp->path,
        ]);

        $jsComponentsContent .= "
            window.onerror = function(msg, url, lineNo, columnNo, error)  {

                var message = [
                    'Message: ' + msg,
                    'URL: ' + url,
                    'Line: ' + lineNo,
                    'Error object: ' + JSON.stringify(error)
                ].join(' - ');

                // $('body').append(navigator.userAgent);

                $('body').append(message);
            };
        ";

        $jsComponentsContent .= "var _C = '$config';";

        // now we need to check if there is any externals files to be loaded
        // js or css files
        $externals = $this->resources['externals'];

        $this->resources['jsFiles'] = [];

        $packagesList = [];

        foreach ($this->resources['packages'] as $packageNamespace => $packagePath) {
            $this->resources['packages'][$packageNamespace] = 'src/' . $packagePath;
        }

        // add a global variable __EXTERNALS__ to the beginning of the vendor file
        $jsComponentsContent .= "var SMART_VIEWS = {}; var __EXTERNALS__ = JSON.parse('" . json_encode($externals, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "');";
        $jsComponentsContent .= "var LANGUAGES = JSON.parse('" . json_encode($this->config->locales) . "');";

        file_put_contents($initPath = $this->staticDir . 'js/__init__.js', $jsComponentsContent);

        $this->resources['jsFiles'][] = '/public/static/' . $this->currentApp->name . '/js/__init__.js';
        $this->resources['jsFiles'][] = '/public/static/' . $this->currentApp->name . '/js/__views__.js';

        foreach ($jsFinder->in($this->resources['packages'])->path('js')->files()->name('*.js') as $file) {
            $jsPath = str_replace('\\', '/', substr($file->getRealPath(), strpos($file->getRealPath(), 'src')));

            if (in_array($jsPath, $this->resources['jsFiles'])) {
                continue;
            }

            $this->resources['jsFiles'][] = $jsPath;
        }

        $this->resources['jsFiles'][] = 'src/apps/' . $this->currentApp->name . '/components/config.js';
        $this->resources['jsFiles'][] = 'src/apps/' . $this->currentApp->name . '/components/routing.js';
        $this->resources['jsFiles'][] = 'src/apps/' . $this->currentApp->name . '/components/app.js';
        $this->resources['jsFiles'][] = 'public/static/' . $this->currentApp->name . '/js/__run__.js';

        $jsRunner = '
            DI.register({
                class: App,
                alias: "app"
            });

            let app = DI.resolve("app");

            app.__bootstrap();

            app.ready(() => {
                app.init();

                if (app.autoRun === true) {
                    app.run();
                }
            });
        ';

        file_put_contents($initPath = $this->staticDir . 'js/__run__.js', $jsRunner);
    }

    /**
     * Compile sass files
     *
     * @return void
     */
    private function compileScss($direction = null)
    {
        $direction = $direction ?: $this->currentApp->direction;
        $scssFinder = new Finder;

        $cssComponentsContent = '';

        // the scss path will be the path of scss folder in the app folder
        // as it will next to components folder
        $scssPath = [
            $this->app->file->to('src/scss'),
            $this->app->file->to('src/apps/' . $this->currentApp->name . '/scss/'),
        ];

        if (file_exists($this->app->file->to('src/apps/' . $this->currentApp->name . '/scss/app.scss'))) {
            // start compiling sass code
            $scss = new Compiler();
            $scss->setImportPaths($scssPath);

            $customSassComponents = '';
            foreach ($scssFinder->in($this->resources['packages'])->path('/scss\/(common|' . $direction . ')/')->sortByName()->name('*.scss') as $file) {
                $customSassComponents .= $file->getContents() . PHP_EOL;
            }

            $cssComponentsContent .= $scss->compile('@import "app.scss";' . $customSassComponents);
        }

        // die;

        file_put_contents($this->staticDir . 'css/app-' . $direction . '.css', $cssComponentsContent);
    }

    /**
     * Collect smart views
     * 
     * @return voids
     */
    protected function collectSmartViews()
    {
        if (! is_dir($this->staticDir . '/smart-views')) {
            mkdir($this->staticDir . '/smart-views', 0777, true);
        }
        
        $smartViewsFinder = new Finder;

        foreach ($smartViewsFinder->in($this->staticDir . '/smart-views')->files()->name('*.js') as $file) {
            $this->scripts[] = str_replace($this->app->file->to(''), '', $file->getRealPath());
        }
    }

    /**
     * Render any html view file
     *
     * @return string
     */
    private function renderHtmlViews()
    {
        $htmlFinder = new Finder;

        $viewsContainer = [];

        $loadedViews = [];

        $s = microtime(true);

        foreach ($htmlFinder->in($this->resources['packages'])->path('html')->files()->name('*.html') as $file) {
            // the full url will be something like
            // C:\xampp\htdocs\app\public\src/components/alert\html\alert.html
            $fullPath = $file->getRealPath();

            if (in_array($fullPath, $loadedViews)) {
                continue;
            }

            $loadedViews[] = $fullPath;

            // remove the full path to the src directory and keep only the relative component path
            // this will be something like
            // components\alert\html\alert.html
            $relativeSrcPath = str_remove_start($fullPath, $this->srcDir);

            // replace the directory separator with /
            // this will be something like
            // components/alert/html/alert.html
            $relativeSrcPath = str_replace(DIRECTORY_SEPARATOR, '/', $relativeSrcPath);

            // if the relative path starts with components
            // then this is treated as a core component view
            // otherwise, it would be an app component view
            if (strpos($relativeSrcPath, $this->framework) === 0) {
                // remove components word
                // this will be something like
                // alert/html/alert.html
                $viewPath = Str::replaceFirst($this->framework . '/', '', $relativeSrcPath);

                // make sure there is no slashes
                $viewPath = trim($viewPath, '/');

                // now we will remove the .html from the end
                // this will be something like
                // alert/html/alert
                $viewPath = str_remove_end($viewPath, '.html');

                // now we will explode the string with / for better data collecting
                // this will be something like
                // [alert, html, alert]
                $viewPath = explode('/', $viewPath);

                // now we will get the view name
                // this will be something like
                // alert
                // and the array will be like
                // [alert, html]
                $viewName = array_pop($viewPath);

                // remove the html element in the array as it will be the last element
                // this will be something like
                // [alert]
                array_pop($viewPath);
                // now we will add the view name to the array again
                // this will be something like
                // [alert, alert]
                $viewPath[] = $viewName;
            } elseif (strpos($relativeSrcPath, 'plugins') === 0) {
                // make sure there is no slashes
                $viewPath = trim($relativeSrcPath, '/');

                // now we will remove the .html from the end
                // this will be something like
                // alert/html/alert
                $viewPath = str_remove_end($viewPath, '.html');

                // now we will explode the string with / for better data collecting
                // this will be something like
                // [alert, html, alert]
                $viewPath = explode('/', $viewPath);

                // now we will get the view name
                // this will be something like
                // alert
                // and the array will be like
                // [alert, html]
                $viewName = array_pop($viewPath);

                // remove the html element in the array as it will be the last element
                // this will be something like
                // [alert]
                array_pop($viewPath);
                // now we will add the view name to the array again
                // this will be something like
                // [alert, alert]
                $viewPath[] = $viewName;
            } else {
                // otherwise, it's an app component view
                // remove app/aapName/components/
                // this will be something like
                // account/addresses/html/hendawy.html
                $viewPath = str_remove_start($relativeSrcPath, 'app/' . $this->currentApp->name . '/components/');
                // make sure there is no slashes
                $viewPath = trim($viewPath, '/');

                // now we will remove the .html from the end
                // this will be something like
                // account/addresses/html/hendawy
                $viewPath = str_remove_end($viewPath, '.html');

                // now we will explode the string with / for better data collecting
                // this will be something like
                // [account, addresses, html, hendawy]
                $viewPath = explode('/', $viewPath);

                // now we will get the view name
                // this will be something like
                // hendawy
                // and the array will be like
                // [account, addresses, html]
                $viewName = array_pop($viewPath);

                // remove the html element in the array as it will be the last element
                // this will be something like
                // [account, addresses]
                array_remove_by_value($viewPath, 'html');
                // now we will add the view name to the array again
                // this will be something like
                // [account, addresses, hendawy]
                $viewPath[] = $viewName;
                // now we will add the app name at the beginning of the view path array
                // so the final array will be something like
                // [store, account, addresses, hendawy]
                array_unshift($viewPath, $this->currentApp->name);
            }

            // now we will convert it to string again
            $componentViewName = implode('/', $viewPath);

            // now we will add the component view to the views container
            $viewsContainer[$componentViewName] = $this->convertHtmlViewsSyntaxToES5($file->getContents());
        }

        // now we will create the js code
        // the __VIEWS__ variable will be a js object that contains all views
        $viewsCode = 'var __VIEWS__ = new Map;';

        $normal = '';

        foreach ($viewsContainer as $key => $viewCode) {
            $normal .= $viewCode;
            $viewCode = $this->escapeJavaScriptText($viewCode);
            $viewsCode .= "__VIEWS__.set('$key',\"$viewCode\");";
        }

        $viewsCode .= PHP_EOL;

        file_put_contents('public/static/' . $this->currentApp->name . '/js/__views__.js', $viewsCode);
    }

    /**
     * Compile the given view to match es5 syntax
     *
     * @param  string $view
     * @return string
     */
    private function convertHtmlViewsSyntaxToES5($view)
    {
        return $view;
        // for loops
        $pattern = '/for\s?';

        $pattern .= '\(let ([^\(]+)\)';

        $pattern .= '/m';

        $view = preg_replace_callback($pattern, function ($matches) {
            if (empty($matches[1])) {
                return '';
            }

            $forContent = $matches[1];

            // it means the developer is using for let...of
            if (Str::contains($forContent, 'of')) {
                list($var, $array) = explode(' of ', $forContent);

                $returned = "for (var i = 0; i < $array.length; i++)" . PHP_EOL;

                $returned .= "\t\t\t " . 'var ' . $var . ' = ' . $array . '[i];' . PHP_EOL;
            } else {
                // it means the let statement is used with the normal for loop
                $returned = "var $forContent";
            }

            return $returned;
        }, $view);

        // let statements
        $pattern = '/let\s(.*)/m';

        $view = preg_replace_callback($pattern, function ($matches) {
            return "var $matches[1]";
        }, $view);

        return $view;
    }

    /**
     * Escape double quotes for rendering html views
     *
     * @param string $string
     * @return string
     */
    private function escapeJavaScriptText($string)
    {
        return str_replace("\n", '\n', str_replace('"', '\"', addcslashes(str_replace("\r", '', (string) $string), "\0..\37'\\")));
    }

    /**
     * Determine whether if the given file exists in the src directory
     *
     * @param string $path
     * @return bool
     */
    private function exists($path)
    {
        return file_exists($this->srcDir . $path);
    }

    /**
     * Get full path in src directory
     *
     * @param string $path
     * @return string
     */
    private function path($path)
    {
        return $this->srcDir . $path;
    }

    /**
     * Get the content of the given file
     *
     * @param string $path
     * @param bool $isJson
     * @return mixed
     */
    private function load($path, $isJson = true)
    {
        $content = file_get_contents($this->path($path));

        if ($isJson) {
            $content = json_decode($content);

            if (json_last_error()) {
                throw new Exception(sprintf('Invalid json syntax in %s', $path));
            }
        }

        return $content;
    }
}

set_time_limit(0);
