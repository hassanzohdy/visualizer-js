(function($){
    $.fn.countdown = function (options) {
        return this.each(function () {
            return new Countdown(this, options);
        });
    };

    class Countdown {
        /**
        * Constructor
        *
        * @param object node
        * @param object options
        */
        constructor(node, options) {
            this.node = node;
            this.element = $(this.node);
            this.options = options || {};
            this.init();
        }

        /**
        * initialize the counter data
        *
        */
        init() {
            this.startTime = this.element.data('start') || this.options.startTime;
            
            if (! this.startTime) {
                this.startTime = Date.now() / 1000;
            } else if (! Is.numeric(this.startTime)) {
                this.startTime = (new Date(this.startTime)).getTime() / 1000;
            }

            this.endTime = this.element.data('end') || this.options.endTime;
            
            if (! Is.numeric(this.endTime)) {
                this.endTime = (new Date(this.endTime)).getTime() / 1000;
            }

            this.remainingTime = this.endTime - this.startTime;

            if (this.remainingTime <= 0) {
                return;
            }

            // set the default time in seconds
            this.timeInSeconds = {
                day: 3600 * 24,
                hour: 3600,
                minute: 60,
            };

            this.interval = setInterval(() => {
                if (this.remainingTime == 0) {
                    clearInterval(this.interval);
                    return;
                }

                this.runCounter();
            }, 1000);
        }

        /**
        * Start calculating remaining time
        *
        */
        runCounter() {
           let remainingDays = Math.floor(this.remainingTime / this.timeInSeconds.day),
                remainingDaysInSeconds = remainingDays * this.timeInSeconds.day,

                remainingHours = Math.floor((this.remainingTime - remainingDaysInSeconds) / this.timeInSeconds.hour),
                remainingHoursInSeconds = remainingHours * this.timeInSeconds.hour,

                remainingMinutes = Math.floor((this.remainingTime - remainingDaysInSeconds - remainingHoursInSeconds) / this.timeInSeconds.minute),
                remainingMinutesInSeconds = remainingMinutes * this.timeInSeconds.minute,

               remainingSeconds = this.remainingTime - remainingDaysInSeconds - remainingHoursInSeconds - remainingMinutesInSeconds;

               // set the number of zeros for the day as it may be more than 99 day

               this.element.find('.days .number').text(this.display(remainingDays, 2));
               this.element.find('.hours .number').text(this.display(remainingHours, 2));
               this.element.find('.minutes .number').text(this.display(remainingMinutes, 2));
               this.element.find('.seconds .number').text(this.display(remainingSeconds, 2));

               // decrease the remaining time
               this.remainingTime--;
        }

        /**
        * Display the given numebr with the total numbers of zero
        * i.e number = 2 , numberOfZeros = 2
        * then the output will be 02
        *
        * @param int number
        * @param int numberLength
        * @return string
        */
        display(number , numberLength = 2) {
            return String(parseInt(number)).padStart(numberLength, '0');
        }
    }
})(jQuery);