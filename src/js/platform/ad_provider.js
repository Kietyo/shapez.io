/* typehints:start */
import { Application } from "../application";
/* typehints:end */

export class AdProviderInterface {
    /** @param {Application} app */
    constructor(app) {
        this.app = app;
    }

    /**
     * Initializes the storage
     * @returns {Promise<void>}
     */
    initialize() {
        return Promise.resolve();
    }

    /**
     * Returns if this provider serves ads at all
     * @returns {boolean}
     * @abstract
     */
    getHasAds() {
        abstract;
        return false;
    }
    /**
     * Shows an video ad
     * @returns {Promise<void>}
     */
    showVideoAd() {
        return Promise.resolve();
    }

    setPlayStatus(playing) {}
}
