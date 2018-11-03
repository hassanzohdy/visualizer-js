<?php
namespace System;

class Html
{
     /**
     * Application Object
     *
     * @var \System\Application
     */
    protected $app;

     /**
     * Html Title
     *
     * @var string
     */
    private $title;

     /**
     * Html description
     *
     * @var string
     */
    private $description;

     /**
     * Html keywords
     *
     * @var string
     */
    private $keywords;

    /**
    * Get table object
    *
    * @var \System\Table
    */
    private $table;

    /**
    * Style sheet files container
    *
    * @var array
    */
    private $stylesheets = [];

    /**
    * Javascript files container
    *
    * @var array
    */
    private $scripts = [];

     /**
     * Constructor
     *
     * @param \System\Application $app
     */
    public function __construct(Application $app)
    {
        $this->app = $app;
    }

    /**
    * Compress the given html content
    *
    * @param string $content
    * @return string
    */
    public function compress($content)
    {
        // Remove Comments
        $compressedCode = preg_replace('/<!--(?!\s*(?:\[if [^\]]+]|<!|>))(?:(?!-->).)*-->/', '', $content);

        // we will have to check if the code have pre
        // then we will disable the new lines removals
        if (strpos($compressedCode, '<pre') === false) {
            $compressedCode = preg_replace('/\s+/', ' ', $compressedCode);
            $compressedCode = str_replace(PHP_EOL, ' ', $compressedCode);
        }

        $compressedCode = trim(str_replace([' />', '> <', '/> <'], ['/>', '><', '/><'], $compressedCode));

        return $compressedCode;
    }

    /**
    * Compress CSS code
    *
    * @param string $code
    * @return string
    */
    public function compressCSS($code)
    {
        // setup the URL and read the CSS from a file
        // $url = 'https://cssminifier.com/raw';

        // // init the request, set various options, and send it
        // $ch = curl_init();

        // curl_setopt_array($ch, [
        //     CURLOPT_URL => $url,
        //     CURLOPT_RETURNTRANSFER => true,
        //     CURLOPT_POST => true,
        //     CURLOPT_HTTPHEADER => ["Content-Type: application/x-www-form-urlencoded"],
        //     CURLOPT_POSTFIELDS => http_build_query([ "input" => $code ]),
        // ]);

        // $minified = curl_exec($ch);

        // // finally, close the request
        // curl_close($ch);

        // return $minified;

        $code = preg_replace('!/\*[^*]*\*+([^/][^*]*\*+)*/!', '', $code);

        // Remove new lines and tabs
        $code = str_replace(array("\n",'.0 ',"\r","\t"),'',$code);

        // replace white spaces with one white space
        $code = preg_replace('/\s+/',' ',$code);

        $code = str_replace([': ',' :'], ':', $code);

        $code = str_replace([', ',' ,'], ',', $code);

        $code = str_replace(['; ',' ;'], ';', $code);

        $code = str_replace(['{ ',' {'], '{', $code);

        $code = str_replace(['} ',' }'], '}', $code);

        $code = str_replace(';}', '}', $code);

        $code = str_replace([' >', '> '], '>', $code);

        $code = str_replace(['@media (','and '], ['@media(', 'and'], $code);

        $code = str_replace([' !important','!important '],'!important', $code);

        $code = str_replace('-0.', '-.', $code);

        $code = str_replace(':0.', ':.', $code);

        $code = str_replace(' 0.', '.', $code);

        // Convert #000000 to #000 and so on
        $code = preg_replace('/#([a-fA-F0-9])\1\K\1{3}/','',$code);

        return $code;
    }

    /**
    * Compress JS Code
    *
    * @param string $code
    * @return string
    */
    public function compressJS($code)
    {
        $url = 'https://closure-compiler.appspot.com/compile';

        $data = [
          'js_code' => str_replace('/**', '/*', $code),
          'output_info'       => 'compiled_code',
          'compilation_level' => 'SIMPLE_OPTIMIZATIONS', // WHITESPACE_ONLY || SIMPLE_OPTIMIZATIONS || ADVANCED_OPTIMIZATIONS
        ];

        $postdata = [
        'http' => [
             'method'  => 'POST',
             'header'  => 'Content-type: application/x-www-form-urlencoded',
             'content' => http_build_query($data),
            ],
         ];

        return file_get_contents($url, false, stream_context_create($postdata));

        $url = 'https://javascript-minifier.com/raw';

        $postdata = ['http' => [
         'method'  => 'POST',
         'header'  => 'Content-type: application/x-www-form-urlencoded',
         'content' => http_build_query( ['input' => $code] ) ] ];

        return file_get_contents($url, false, stream_context_create($postdata));
    }

    /**
    * Get table object
    *
    * @return \System\Table
    */
    public function table()
    {
        if (is_null($this->table)) {
            $this->table = new Table($this->app);
        }

        return $this->table;
    }

     /**
     * Set Title
     *
     * @param string $title
     * @return $this
     */
    public function setTitle($title)
    {
        $this->title = $title;

        return $this;
    }

     /**
     * Get Title
     *
     * @return string
     */
    public function getTitle()
    {
        return $this->title;
    }

    /**
    * Short method to Set|Get page title
    *
    * @param string $title
    * @return string|$this
    */
    public function title($title = null)
    {
        if (is_null($title)) {
            return $this->title;
        }

        $this->title = $title;

        return $this;
    }

     /**
     * Set Keywords
     *
     * @param string $keywords
     * @return $this
     */
    public function setKeywords($keywords)
    {
        $this->keywords = $keywords;

        return $this;
    }

     /**
     * Get Keywords
     *
     * @return string
     */
    public function getKeywords()
    {
        return $this->keywords;
    }

     /**
     * Set Description
     *
     * @param string $description
     * @return $this
     */
    public function setDescription($description)
    {
        $this->description = $description;

        return $this;
    }

     /**
     * Get Description
     *
     * @return string
     */
    public function getDescription()
    {
        return $this->description;
    }

    /**
    * Pre-pend file
    *
    * @param string $type
    * @param string|array $link
    * @return $this
    */
    public function prepend($type, $link)
    {
        if ($type == 'css') {
            $this->stylesheets = array_merge(array_filter((array) $link), $this->stylesheets);
        } elseif ($type == 'js') {
            $this->scripts = array_merge(array_filter((array) $link), $this->scripts);
        }

        return $this;
    }

    /**
    * Add stylesheet(s) to list
    *
    * @param string|array $link
    * @return $this
    */
    public function addStyleSheet($link)
    {
        $this->stylesheets = array_merge($this->stylesheets, array_filter((array) $link));

        return $this;
    }

    /**
    * Add scripts(s) to list
    *
    * @param string|array $link
    * @return $this
    */
    public function addScript($link)
    {
        $this->scripts = array_merge($this->scripts, array_filter((array) $link));

        return $this;
    }

    /**
    * Compile all css files in one file
    *
    * @param string $savePath
    * @return string the full generated link
    */
    public function compileCSS($savePath)
    {
        $content = '';

        foreach ($this->stylesheets AS $style) {
            $content .= $this->compressCSS(@file_get_contents($style));
        }

        file_put_contents($this->app->file->toPublic($savePath), $content);

        return assets($savePath);
    }

    /**
    * Get all stylesheets
    *
    * @return array
    */
    public function stylesheets()
    {
        return $this->stylesheets;
    }

    /**
    * Get all scripts
    *
    * @return array
    */
    public function scripts()
    {
        return $this->scripts;
    }

}