/* typehints:start */
import { Application } from "../application";
/* typehints:end */

export class AnalyticsInterface {
    constructor(app) {
        /** @type {Application} */
        this.app = app;
    }

    /**
     * Initializes the analytics
     * @returns {Promise<void>}
     * @abstract
     */
    initialize() {
        abstract;
        return Promise.reject();
    }

// LEGACY 1.5.3
}
