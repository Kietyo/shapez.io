import { AnalyticsInterface } from "../analytics";
import { createLogger } from "../../core/logging";

const logger = createLogger("ga");

export class GoogleAnalyticsImpl extends AnalyticsInterface {
    initialize() {
// Analytics is already loaded in the html
        return Promise.resolve();
    }
}
