import {PlatformWrapperImplBrowser} from "../browser/wrapper";
import {createLogger} from "../../core/logging";
import {StorageImplElectron} from "./storage";
import {PlatformWrapperInterface} from "../wrapper";

const logger = createLogger("electron-wrapper");

export class PlatformWrapperImplElectron extends PlatformWrapperImplBrowser {
    initialize() {
        this.dlcs = {
            puzzle: false,
        };

        this.steamOverlayCanvasFix = document.createElement("canvas");
        this.steamOverlayCanvasFix.width = 1;
        this.steamOverlayCanvasFix.height = 1;
        this.steamOverlayCanvasFix.id = "steamOverlayCanvasFix";

        this.steamOverlayContextFix = this.steamOverlayCanvasFix.getContext("2d");
        document.documentElement.appendChild(this.steamOverlayCanvasFix);

        this.app.ticker.frameEmitted.add(this.steamOverlayFixRedrawCanvas, this);

        this.app.storage = new StorageImplElectron(this);

        return this.initializeDlcStatus()
            .then(() => PlatformWrapperInterface.prototype.initialize.call(this));
    }

    steamOverlayFixRedrawCanvas() {
        this.steamOverlayContextFix.clearRect(0, 0, 1, 1);
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

    initializeDlcStatus() {

        logger.log("Checking DLC ownership ...");
        // @todo: Don't hardcode the app id
        return ipcRenderer.invoke("steam:check-app-ownership", 1625400).then(
            res => {
                logger.log("Got DLC ownership:", res);
                this.dlcs.puzzle = Boolean(res);
            },
            err => {
                logger.error("Failed to get DLC ownership:", err);
            }
        );
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
