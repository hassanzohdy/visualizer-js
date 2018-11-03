<?php
namespace System\CLI\Commands;

use System\CLI\Config;
use System\CLI\Command;

class GlobalConfigurations extends Command
{
    /**
     * {@inheritDoc}
     */
    public function execute()
    {
        $flags = static::flagsList();

        if (! $flags) {
            return static::error('Pleas specify at least one configuration!');
        }

        foreach ($flags as $flag => $value) {
            if (! Config::accepts($flag)) {
                return static::error(sprintf('Undefined option %s', $flag));
            }
        }

        Config::create($flags);
        
        static::green('Global configurations has been updated successfully!');
    }
}
