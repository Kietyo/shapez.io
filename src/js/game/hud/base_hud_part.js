/* typehints:start */
import {GameRoot} from "../root";
import {DrawParameters} from "../../core/draw_parameters";
/* typehints:end */
import {ClickDetector} from "../../core/click_detector";

export class BaseHUDPart {
    /**
     * @param {GameRoot} root
     */
    constructor(root) {
        this.root = root;

        /** @type {Array<ClickDetector>} */
        this.clickDetectors = [];
    }

    /**
     * Should create all require elements
     * @param {HTMLElement} parent
     */
    createElements(parent) {}

    /**
     * Should initialize the element, called *after* the elements have been created
     * @abstract
     */
    initialize() {
        abstract;
    }

    /**
     * Should update any required logic
     */
    update() {}

    /**
     * Should draw the hud
     * @param {DrawParameters} parameters
     */
    draw(parameters) {}

    /**
     * Should draw any overlays (screen space)
     * @param {DrawParameters} parameters
     */
    drawOverlays(parameters) {}

    /**
     * Should return true if the widget has a modal dialog opened and thus
     * the game does not need to update / redraw
     * @returns {boolean}
     */
    shouldPauseRendering() {
        return false;
    }

    /**
     * Should return false if the game should be paused
     * @returns {boolean}
     */
    shouldPauseGame() {
        return false;
    }

    /**
     * Should return true if this overlay is open and currently blocking any user interaction
     */
    isBlockingOverlay() {
        return false;
    }

    /**
     * Cleans up the hud element, if overridden make sure to call super.cleanup
     */
    cleanup() {
        this.cleanupClickDetectors();
    }

    /**
     * Cleans up all click detectors
     */
    cleanupClickDetectors() {
        if (this.clickDetectors) {
            for (let i = 0; i < this.clickDetectors.length; ++i) {
                this.clickDetectors[i].cleanup();
            }
            this.clickDetectors = [];
        }
    }

    /**
     * Should close the element, in case its supported
     */
    close() {}

    // Helpers

    /**
     * Helper method to construct a new click detector
     * @param {Element} element The element to listen on
     * @param {function} handler The handler to call on this object
     * @param {import("../../core/click_detector").ClickDetectorConstructorArgs=} args Click detector arguments
     *
     */
    trackClicks(element, handler, args = {}) {
        const detector = new ClickDetector(element, args);
        detector.click.add(handler, this);
        this.registerClickDetector(detector);
    }

    /**
     * Registers a new click detector
     * @param {ClickDetector} detector
     */
    registerClickDetector(detector) {
        this.clickDetectors.push(detector);
        if (G_IS_DEV) {
            // @ts-ignore
            detector._src = "hud-" + this.constructor.name;
        }
    }
}
