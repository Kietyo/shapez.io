import {createLogger} from "../../core/logging";
import {StorageImplBrowser} from "./storage";
import {StorageImplBrowserIndexedDB} from "./storage_indexed_db";

const logger = createLogger("platform/browser");

export class PlatformWrapperImplBrowser {
    initialize() {
        this.embedProvider = {
            id: "shapezio-website",
            iframed: false,
            externalLinks: true,
        };

        logger.log("Embed provider:", this.embedProvider.id);

        return this.detectStorageImplementation()
            .then(() => {
                document.documentElement.classList.add("p-" + this.getId());
                return Promise.resolve();
            });
    }

    detectStorageImplementation() {
        return new Promise(resolve => {
            logger.log("Detecting storage");

            if (!window.indexedDB) {
                logger.log("Indexed DB not supported");
                this.app.storage = new StorageImplBrowser(this.app);
                resolve();
                return;
            }

            // Try accessing the indexedb
            let request;
            try {
                request = window.indexedDB.open("indexeddb_feature_detection", 1);
            } catch (ex) {
                logger.warn("Error while opening indexed db:", ex);
                this.app.storage = new StorageImplBrowser(this.app);
                resolve();
                return;
            }
            request.onerror = err => {
                logger.log("Indexed DB can *not* be accessed: ", err);
                logger.log("Using fallback to local storage");
                this.app.storage = new StorageImplBrowser(this.app);
                resolve();
            };
            request.onsuccess = () => {
                logger.log("Indexed DB *can* be accessed");
                this.app.storage = new StorageImplBrowserIndexedDB(this.app);
                resolve();
            };
        });
    }

    getId() {
        return "browser@" + this.embedProvider.id;
    }

    performRestart() {
        logger.log("Performing restart");
        window.location.reload(true);
    }

    //////////////////////////////////////////////////

    constructor(app) {
        /** @type {Application} */
        this.app = app;
    }
}
