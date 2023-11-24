export class ExplainedResult {
    constructor(result = true, reason = null, additionalProps = {}) {
        /** @type {boolean} */
        this.result = result;

        /** @type {string} */
        this.reason = reason;

        // Copy additional props
        for (const key in additionalProps) {
            this[key] = additionalProps[key];
        }
    }

    isGood() {
        return !!this.result;
    }

    isBad() {
        return !this.result;
    }

    static good() {
        return new ExplainedResult(true);
    }

    static bad(reason, additionalProps) {
        return new ExplainedResult(false, reason, additionalProps);
    }
}
