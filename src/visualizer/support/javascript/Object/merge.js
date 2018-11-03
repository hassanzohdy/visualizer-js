/**
 * An alias function to $.extend method in jquery for deep merging
 *
 * @param ...objects
 * @return object
 */
Object.merge = (...objects) => $.extend(true, {}, ...objects);
