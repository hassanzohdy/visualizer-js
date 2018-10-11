/**
 * This function is used to calculate the elapsed time 
 * If the `returning` parameter is `highestOnlyShort`, then it will return the 
 * highest remaining time
 * For example if the remaining time is: 3 days, 6 hours, 20 minutes, 40 seconds
 * Then it will return: 3d 
 * 
 * @param   string endTime 
 * @param   string startTime
 * @param   string returning 
 * @returns string 
 */
const endsAfter = (endTime, startTime = null, returning = 'highestOnlyShort') => {
  // record start time
  startTime = startTime ? new Date(startTime) : new Date;
  // later record end time
  endTime = new Date(endTime);
  // time difference in ms
  let timeDiff = endTime - startTime,
    // highest value 
    highestValue = null;

  // strip the ms
  timeDiff /= 1000;

  // get seconds (Original had 'round' which incorrectly counts 0:28, 0:29, 1:30 ... 1:59, 1:0)
  let seconds = Math.round(timeDiff % 60);

  // remove seconds from the date
  timeDiff = Math.floor(timeDiff / 60);

  // get minutes
  let minutes = Math.round(timeDiff % 60);

  // remove minutes from the date
  timeDiff = Math.floor(timeDiff / 60);

  // get hours
  let hours = Math.round(timeDiff % 24);

  // remove hours from the date
  timeDiff = Math.floor(timeDiff / 24);

  // the rest of timeDiff is number of days
  let days = timeDiff;

  if (returning == 'highestOnlyShort' && days) {
    return days + 'd';
  }

  return (
    (hours ? hours + ':' : '') +
    (minutes ? minutes + ' ' : '') +
    (seconds ? seconds + ' ' : '')
  );
};