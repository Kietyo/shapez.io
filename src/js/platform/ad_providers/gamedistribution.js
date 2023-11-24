/* typehints:start */
import { Application } from "../../application";
/* typehints:end */

import { AdProviderInterface } from "../ad_provider";
import { createLogger } from "../../core/logging";
const logger = createLogger("gamedistribution");

export class GamedistributionAdProvider extends AdProviderInterface {
    /**
     *
     * @param {Application} app
     */
    constructor(app) {
        super(app);

        /**
         * The resolve function to finish the current video ad. Null if none is currently running
         * @type {Function}
         */
        this.videoAdResolveFunction = null;
    }

    getHasAds() {
        return true;
    }

    initialize() {
        // No point to initialize everything if ads are not supported
        if (!this.getHasAds()) {
            return Promise.resolve();
        }

        logger.log("🎬 Initializing gamedistribution ads");

        try {
            parent.postMessage("shapezio://gd.game_loaded", "*");
        } catch (ex) {
            return Promise.reject("Frame communication not allowed");
        }

        window.addEventListener(
            "message",
            event => {
                if (event.data === "shapezio://gd.ad_started") {
                    console.log("🎬 Got ad started callback");
                } else if (event.data === "shapezio://gd.ad_finished") {
                    console.log("🎬 Got ad finished callback");
                    if (this.videoAdResolveFunction) {
                        this.videoAdResolveFunction();
                    }
                }
            },
            false
        );

        return Promise.resolve();
    }
}
