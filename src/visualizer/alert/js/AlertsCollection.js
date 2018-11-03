class AlertsCollection {
    /**
    * Constructor
    *
    */
    constructor(type) {
        this.type = type;

        this.alerts = {};
    }

    /**
    * Add new alert
    *
    * @param AlertItem alert
    */
    add(alert) {
        this.alerts[alert.id] = alert;
    }

    /**
    * Clear all alerts
    *
    */
    clear(animation) {
        for (let alertId in this.alerts) {
            this.alerts[alertId].remove(animation);
        }
    }

    /**
     * Finish all alerts immediately
     */
    finish() {
        for (let alertId in this.alerts) {
            this.alerts[alertId].finish();
        }
    }
}