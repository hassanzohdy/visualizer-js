
/**
 * A flag for ago function
 */
const TIME_IN_SECONDS = true;

/**
 * Convert timestamp to human readable time
 * @param int timestamp 
 * @returns string
 */
const ago = (timestamp, timeMode = false) => {
    if (Is.string(timestamp)) {
        timestamp = (new Date(timestamp)).now();
    } else if (timeMode === TIME_IN_SECONDS) {
        timestamp *= 1000;
    }

    return timeago().format(timestamp);
};
