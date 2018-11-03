<?php
namespace System;

use Illuminate\Support\Collection as BaseCollection;

class Collection extends BaseCollection
{
    /**
     * Walk through every item and edit it
     *
     * @param callable $callback
     * @return void
     */
    public function walk(callable $callback)
    {
        array_walk($this->items, $callback);
    }

    /**
     * Add new item  to the beginning of the collection
     *
     * @param mixed $item
     * @return void
     */
    public function unshift(...$item)
    {
        array_unshift($this->items, ...$item);
    }
}