<?php
namespace System;

class File
{
     /**
     * Directory Separator
     *
     * @const string
     */
    const DS = DIRECTORY_SEPARATOR;

     /**
     * Root Path
     *
     * @var string
     */
    private $root;

     /**
     * Constructor
     *
     * @param string $root
     */
    public function __construct($root)
    {
        $this->root = $root;
    }

     /**
     * Determine wether the given file path exists
     *
     * @param string $file
     * @param bool $isRelativeFile
     * @return bool
     */
    public function exists($file, $isRelativeFile = true)
    {
        $file = $isRelativeFile ? $this->to($file) :  $file;
        return file_exists($file);
    }

    /**
    * Delete file|folder
    *
    * @param string $path
    * @return void
    */
    public function delete($path)
    {
        if (! file_exists($path)) {
            return;
        }

        if (is_dir($path)) {
            // delete directory recursively
            $objects = scandir($path);
            foreach ($objects AS $object) {
                if ($object != '.' AND $object != '..') {
                    $objectPath = $path . '/' . $object;

                    if (is_dir($objectPath)) {
                        $this->delete($objectPath);
                    } else {
                        unlink($objectPath);
                    }
                }
            }

            rmdir($path);
        } else {
            unlink($path);
        }
    }

     /**
     * Require The given file
     *
     * @param string $file
     * @return mixed
     */
    public function call($file)
    {
        return require $this->to($file);
    }

     /**
     * Generate full path to the given path in vendor folder
     *
     * @param string $path
     * @return string
     */
    public function toVendor($path)
    {
        return $this->to('vendor/' . $path);
    }

     /**
     * Generate full path to the given path in public folder
     *
     * @param string $path
     * @return string
     */
    public function toPublic($path)
    {
        return $this->to('public/' . $path);
    }

    /**
    * Get File content
    *
    * @param string $path
    * @param bool $isRelative
    * @return string
    */
    public function content($path, $isRelative = true)
    {
        $path = $isRelative ? $this->to($path) : $path;

        return @file_get_contents($path);
    }

    /**
    * Set File content
    *
    * @param string $path
    * @param string $content
    * @return mixed
    */
    public function put($path, $content)
    {
        $path = $this->to($path);

        return file_put_contents($path, $content);
    }

     /**
     * Generate full path to the given path in App folder
     *
     * @param string $path
     * @return string
     */
    public function toApp($path)
    {
        return $this->to('App/' . $path);
    }

     /**
     * Generate full path to the given path in storage folder
     *
     * @param string $path
     * @return string
     */
    public function toStorage($path)
    {
        return $this->to('storage/' . $path);
    }

   /**
   * Generate full path to the given path
   *
   * @param string $path
   * @return string
   */
  public function to($path)
  {
      return $this->root . static::DS . str_replace(['/', '\\'], static::DS, $path);
  }
}