/* typehints:start */
import {Application} from "../application";
/* typehints:end */
import {ExplainedResult} from "./explained_result";
import {ReadWriteProxy} from "./read_write_proxy";

export class RestrictionManager extends ReadWriteProxy {
    /**
     * @param {Application} app
     */
    constructor(app) {
        super(app, "restriction-flags.bin");

        this.currentData = this.getDefaultData();
    }

    // -- RW Proxy Impl

    /**
     * @param {any} data
     */
    verify(data) {
        return ExplainedResult.good();
    }

    /**
     */
    getDefaultData() {
        return {
            version: this.getCurrentVersion(),
        };
    }

    /**
     */
    getCurrentVersion() {
        return 1;
    }

    /**
     * @param {any} data
     */
    migrate(data) {
        return ExplainedResult.good();
    }

    initialize() {
        return this.readAsync();
    }

}
