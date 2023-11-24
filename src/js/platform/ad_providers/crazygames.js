import { AdProviderInterface } from "../ad_provider";
import { createLogger } from "../../core/logging";
import { timeoutPromise } from "../../core/utils";

const logger = createLogger("crazygames");

export class CrazygamesAdProvider extends AdProviderInterface {
    getHasAds() {
        return true;
    }

    initialize() {
        if (!this.getHasAds()) {
            return Promise.resolve();
        }

        logger.log("🎬 Initializing crazygames SDK");

        const scriptTag = document.createElement("script");
        scriptTag.type = "text/javascript";

        return timeoutPromise(
            new Promise((resolve, reject) => {
                scriptTag.onload = resolve;
                scriptTag.onerror = reject;
                scriptTag.src = "https://sdk.crazygames.com/crazygames-sdk-v1.js";
                document.head.appendChild(scriptTag);
            })
                .then(() => {
                    logger.log("🎬  Crazygames SDK loaded, now initializing");
                })
                .catch(ex => {
                    console.warn("Failed to init crazygames SDK:", ex);
                })
        );
    }

}
