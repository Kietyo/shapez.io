import {createLogger} from "./logging";
import {fastArrayDeleteValueIfContained} from "./utils";

const logger = createLogger("request_channel");

// Thrown when a request is aborted
export class RequestChannel {
    constructor() {
        /** @type {Array<Promise>} */
        this.pendingPromises = [];
    }

    /**
     *
     * @param {Promise<any>} promise
     * @returns {Promise<any>}
     */
    watch(promise) {
        // log(this, "Added new promise:", promise, "(pending =", this.pendingPromises.length, ")");
        let cancelled = false;
        const wrappedPromise = new Promise((resolve, reject) => {
            promise.then(
                result => {
                    // Remove from pending promises
                    fastArrayDeleteValueIfContained(this.pendingPromises, wrappedPromise);

                    // If not cancelled, resolve promise with same payload
                    if (!cancelled) {
                        resolve.call(this, result);
                    } else {
                        logger.warn("Not resolving because promise got cancelled");
                    }
                },
                err => {
                    // Remove from pending promises
                    fastArrayDeleteValueIfContained(this.pendingPromises, wrappedPromise);

                    // If not cancelled, reject promise with same payload
                    if (!cancelled) {
                        reject.call(this, err);
                    } else {
                        logger.warn("Not rejecting because promise got cancelled");
                    }
                }
            );
        });

        // Add cancel handler
        // @ts-ignore
        wrappedPromise.cancel = function () {
            cancelled = true;
        };

        this.pendingPromises.push(wrappedPromise);
        return wrappedPromise;
    }

    cancelAll() {
        if (this.pendingPromises.length > 0) {
            logger.log("Cancel all pending promises (", this.pendingPromises.length, ")");
        }
        for (let i = 0; i < this.pendingPromises.length; ++i) {
            // @ts-ignore
            this.pendingPromises[i].cancel();
        }
        this.pendingPromises = [];
    }
}
