/* typehints:start */
import { Application } from "../../application";
/* typehints:end */

import { AdProviderInterface } from "../ad_provider";
import { createLogger } from "../../core/logging";
import { ClickDetector } from "../../core/click_detector";
import { clamp } from "../../core/utils";
import { T } from "../../translations";

const logger = createLogger("adprovider/adinplay");

const minimumTimeBetweenVideoAdsMs = G_IS_DEV ? 1 : 15 * 60 * 1000;

export class AdinplayAdProvider extends AdProviderInterface {
    /**
     *
     * @param {Application} app
     */
    constructor(app) {
        super(app);

        /** @type {ClickDetector} */
        this.getOnSteamClickDetector = null;

        /** @type {Element} */
        this.adContainerMainElement = null;

        /**
         * The resolve function to finish the current video ad. Null if none is currently running
         * @type {Function}
         */
        this.videoAdResolveFunction = null;

        /**
         * The current timer which will timeout the resolve
         */
        this.videoAdResolveTimer = null;

        /**
         * When we showed the last video ad
         */
        this.lastVideoAdShowTime = -1e20;
    }

    getHasAds() {
        return true;
    }

    getCanShowVideoAd() {
        return false;
    }

    initialize() {
        // No point to initialize everything if ads are not supported
        if (!this.getHasAds()) {
            return Promise.resolve();
        }

        logger.log("🎬 Initializing Adinplay");

        // Add the preroll element
        this.adContainerMainElement = document.createElement("div");
        this.adContainerMainElement.id = "adinplayVideoContainer";
        this.adContainerMainElement.innerHTML = `
            <div class="adInner">
                <div class="videoInner">

                </div>
            </div>
        `;

        // Add the setup script
        const setupScript = document.createElement("script");
        setupScript.textContent = `
            var aiptag = aiptag || {};
            aiptag.cmd = aiptag.cmd || [];
            aiptag.cmd.display = aiptag.cmd.display || [];
            aiptag.cmd.player = aiptag.cmd.player || [];
        `;
        document.head.appendChild(setupScript);

        window.aiptag.gdprShowConsentTool = 0;
        window.aiptag.gdprAlternativeConsentTool = 1;
        window.aiptag.gdprConsent = 1;

        const scale = this.app.getEffectiveUiScale();
        const targetW = 960;
        const targetH = 540;

        const maxScaleX = (window.innerWidth - 100 * scale) / targetW;
        const maxScaleY = (window.innerHeight - 150 * scale) / targetH;

        const scaleFactor = clamp(Math.min(maxScaleX, maxScaleY), 0.25, 2);

        const w = Math.round(targetW * scaleFactor);
        const h = Math.round(targetH * scaleFactor);

        // Add the player
        const videoElement = this.adContainerMainElement.querySelector(".videoInner");
        /** @type {HTMLElement} */
        const adInnerElement = this.adContainerMainElement.querySelector(".adInner");

        adInnerElement.style.maxWidth = w + "px";

        const self = this;
        window.aiptag.cmd.player.push(function () {
            window.adPlayer = new window.aipPlayer({
                AD_WIDTH: w,
                AD_HEIGHT: h,
                AD_FULLSCREEN: false,
                AD_CENTERPLAYER: false,
                LOADING_TEXT: T.global.loading,
                PREROLL_ELEM: function () {
                    return videoElement;
                },
                AIP_COMPLETE: function () {
                    logger.log("🎬 ADINPLAY AD: completed");
                    self.adContainerMainElement.classList.add("waitingForFinish");
                },
                AIP_REMOVE: function () {
                    logger.log("🎬 ADINPLAY AD: remove");
                    if (self.videoAdResolveFunction) {
                        self.videoAdResolveFunction();
                    }
                },
            });
        });

        // Load the ads
        const aipScript = document.createElement("script");
        aipScript.src = "https://api.adinplay.com/libs/aiptag/pub/YRG/shapez.io/tag.min.js";
        aipScript.setAttribute("async", "");
        document.head.appendChild(aipScript);

        return Promise.resolve();
    }
}
