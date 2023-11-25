import {PlatformWrapperImplBrowser} from "../browser/wrapper";
import {createLogger} from "../../core/logging";
import {StorageImplElectron} from "./storage";
import {PlatformWrapperInterface} from "../wrapper";

const logger = createLogger("electron-wrapper");

export class PlatformWrapperImplElectron extends PlatformWrapperImplBrowser {
    initialize() {
        this.app.storage = new StorageImplElectron(this);

        return PlatformWrapperInterface.prototype.initialize.call(this);
    }

    getId() {
        return "electron";
    }

    getSupportsRestart() {
        return true;
    }

    openExternalLink(url) {
        logger.log(this, "Opening external:", url);
        window.open(url, "about:blank");
    }

    performRestart() {
        logger.log(this, "Performing restart");
        window.location.reload(true);
    }

    getSupportsFullscreen() {
        return true;
    }

    setFullscreen(flag) {
        ipcRenderer.send("set-fullscreen", flag);
    }

    exitApp() {
        logger.log(this, "Sending app exit signal");
        ipcRenderer.send("exit-app");
    }
}
