class HumanTime {
    /**
     * Constructor
     */
    constructor(events) {
        this.events = events;
    }

    /**
     * Auto convert all times once the given event(s) are loaded
     */
    loadOn(events) {
        this.events.on(events, () => {
            this.convert();
        });
    }

    /**
     * Start converting human times
     */
    convert() {
        let $this = this;

        $('.ago, .ends-after').each(function () {
            let element = $(this);
            if (element.hasClass('ago')) {
                $this.agoElement(element);
            } else if (element.hasClass('ends-after')) {
                $this.endsAfterElement(element);
            }
        });
    }

    /**
     * Trigger a human past time
     * 
     * @param jQuery element
     */
    agoElement(element) {
        if (!element.attr('id')) {
            element.attr('id', Random.id());
        }

        let elementId = element.attr('id'),
            startTime = element.data('start-time');

        element.html(this.ago(startTime));

        let timer = setInterval(() => {
            if ($(`#${elementId}`).length == 0) {
                clearInterval(timer);
                return;
            }

            let humanTime = this.ago(startTime);

            if (humanTime == '00:00') {
                clearInterval(timer);
            }

            if (element.html() != humanTime) {
                element.html(humanTime);
            }
        }, 1000);
    }

    /**
     * Convert timestamp to human readable time
     * @param int timestamp 
     * @returns string
     */
    ago(timestamp, timeMode = false) {
        if (Is.string(timestamp)) {
            timestamp = new Date(timestamp).getTime();
        } else if (timeMode === HumanTime.TIME_IN_SECONDS) {
            timestamp *= 1000;
        }

        return timeago().format(timestamp);
    }

    /**
     * Trigger a human past time
     * 
     * @param jQuery element
     */
    endsAfterElement(element) {
        if (!element.attr('id')) {
            element.attr('id', Random.id());
        }

        let elementId = element.attr('id'),
            startTime = element.data('start-time'),
            endTime = element.data('end-time');

        element.html(this.endsAfter(endTime, startTime));

        let timer = setInterval(() => {
            if ($(`#${elementId}`).length == 0) {
                clearInterval(timer);
                return;
            }

            let humanTime = this.endsAfter(endTime, startTime);

            if (humanTime == '00:00') {
                clearInterval(timer);
            }

            if (element.html() != humanTime) {
                element.html(humanTime);
            }
        }, 1000);
    }

    /**
     * This function is used to calculate the elapsed time 
     * If the `format` parameter is `highestOnlyShort`, then it will return the 
     * highest remaining time
     * For example if the remaining time is: 3 days, 6 hours, 20 minutes, 40 seconds
     * Then it will return: 3d 
     * 
     * @param   string endTime 
     * @param   string startTime
     * @param   string format 
     * @returns string 
     */
    endsAfter(endTime, startTime = null, format = 'highestOnlyShort') {
        // record start time
        startTime = startTime ? new Date(startTime) : new Date;
        // later record end time
        endTime = new Date(endTime);
        // time difference in ms
        let timeDiff = endTime - startTime;

        if (timeDiff <= 0) return '00:00';

        // strip the ms
        timeDiff /= 1000;

        // get seconds (Original had 'round' which incorrectly counts 0:28, 0:29, 1:30 ... 1:59, 1:0)
        let seconds = String(Math.round(timeDiff % 60)).padStart(2, '0');

        // remove seconds from the date
        timeDiff = Math.floor(timeDiff / 60);

        // get minutes
        let minutes = String(Math.round(timeDiff % 60)).padStart(2, '0');

        // remove minutes from the date
        timeDiff = Math.floor(timeDiff / 60);

        // get hours
        let hours = String(Math.round(timeDiff % 24)).padStart(2, '0');

        // remove hours from the date
        timeDiff = Math.floor(timeDiff / 24);

        // the rest of timeDiff is number of days
        let days = timeDiff;

        if (format == 'highestOnlyShort' && days) {
            return days + 'd';
        }

        if (seconds && String(seconds).length == 1) {
            seconds = '0' + String(seconds);
        }

        if (minutes && String(minutes).length == 1) {
            minutes = '0' + String(minutes);
        }

        if (hours && String(hours).length == 1) {
            hours = '0' + String(hours);
        }

        return (
            (hours ? hours + ':' : '') +
            (minutes ? minutes + ':' : '') +
            (seconds || '')
        );
    }
}

HumanTime.TIME_IN_SECONDS = true;

DI.register({
    class: HumanTime,
    alias: 'humanTime',
});