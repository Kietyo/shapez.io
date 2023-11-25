const fs = require("fs");
const path = require("path");
const { ipcMain } = require("electron");

let greenworks = null;
let appId = null;
let initialized = false;

try {
    greenworks = require("shapez.io-private-artifacts/steam/greenworks");
    appId = parseInt(fs.readFileSync(path.join(__dirname, "steam_appid.txt"), "utf8"));
} catch (err) {
    // greenworks is not installed
    console.warn("Failed to load steam api:", err);
}

console.log("App ID:", appId);

function init(isDev) {
    if (!greenworks) {
        return;
    }

    if (!isDev) {
        if (greenworks.restartAppIfNecessary(appId)) {
            console.log("Restarting ...");
            process.exit(0);
        }
    }

    if (!greenworks.init()) {
        console.log("Failed to initialize greenworks");
        process.exit(1);
    }

    initialized = true;
}
module.exports = {
    init,
};
