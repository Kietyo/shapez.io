/* typehints:start */
import { Application } from "../application";
/* typehints:end */

import { IS_MOBILE } from "../core/config";

export class PlatformWrapperInterface {
    constructor(app) {
        /** @type {Application} */
        this.app = app;
    }

    /** @returns {string} */
    getId() {
        abstract;
        return "unknown-platform";
    }

    /**
     * Returns the UI scale, called on every resize
     * @returns {number} */
    getUiScale() {
        return 1;
    }

    /** @returns {boolean} */
    getSupportsRestart() {
        abstract;
        return false;
    }

    /**
     * Returns the strength of touch pans with the mouse
     */
    getTouchPanStrength() {
        return 1;
    }

    /** @returns {Promise<void>} */
    initialize() {
        document.documentElement.classList.add("p-" + this.getId());
        return Promise.resolve();
    }

    /**
     * Should initialize the apps ad provider in case supported
     *  @returns {Promise<void>}
     */
    initializeAdProvider() {
        return Promise.resolve();
    }
    getScreenScale() {
        return Math.min(window.innerWidth, window.innerHeight) / 1024.0;
    }
    /**
     * Attempt to open an external url
     * @param {string} url
     * @param {boolean=} force Whether to always open the url even if not allowed
     * @abstract
     */
    openExternalLink(url, force = false) {
        abstract;
    }

    /**
     * Attempt to restart the app
     * @abstract
     */
    performRestart() {
        abstract;
    }

    /**
     * Returns whether this platform supports a toggleable fullscreen
     */
    getSupportsFullscreen() {
        return false;
    }

    /**
     * Should set the apps fullscreen state to the desired state
     * @param {boolean} flag
     * @abstract
     */
    setFullscreen(flag) {
        abstract;
    }
    /**
     * Attempts to quit the app
     * @abstract
     */
    exitApp() {
        abstract;
    }

    /**
     * Whether this platform supports a keyboard
     */
    getSupportsKeyboard() {
        return !IS_MOBILE;
    }
}
