import { AnalyticsInterface } from "../analytics";

export class GoogleAnalyticsImpl extends AnalyticsInterface {
    initialize() {
// Analytics is already loaded in the html
        return Promise.resolve();
    }
}
