import {openStandaloneLink, THIRDPARTY_URLS} from "../core/config";
import {WEB_STEAM_SSO_AUTHENTICATED} from "../core/steam_sso";
import {TextualGameState} from "../core/textual_game_state";
import {T} from "../translations";

export class ModsState extends TextualGameState {
    constructor() {
        super("ModsState");
    }

    getStateHeaderTitle() {
        return T.mods.title;
    }

    get modsSupported() {
        return (
            !WEB_STEAM_SSO_AUTHENTICATED &&
            (G_IS_STANDALONE || (G_IS_DEV && !window.location.href.includes("demo")))
        );
    }

    internalGetFullHtml() {
        let headerHtml = `
            <div class="headerBar">
                <h1><button class="backButton"></button> ${this.getStateHeaderTitle()}</h1>

            </div>`;

        return `
            ${headerHtml}
            <div class="container">
                    ${this.getInnerHTML()}
            </div>
        `;
    }

    getMainContentHTML() {
        if (!this.modsSupported) {
            return `
                <div class="noModSupport">

                    <p>${WEB_STEAM_SSO_AUTHENTICATED ? T.mods.browserNoSupport : T.mods.noModSupport}</p>
                    <br>
                    <button class="styledButton browseMods">${T.mods.browseMods}</button>
                    <a href="#" class="steamLink steam_dlbtn_0" target="_blank">Get on Steam!</a>


                </div>
            `;
        }

        let modsHtml = ``;
        return `

            <div class="modsStats">
                ${T.mods.modsInfo}
            </div>

            <div class="modsList">
                ${modsHtml}
           </div>
        `;
    }

    onEnter() {
        const steamLink = this.htmlElement.querySelector(".steamLink");
        if (steamLink) {
            this.trackClicks(steamLink, this.onSteamLinkClicked);
        }
        const openModsFolder = this.htmlElement.querySelector(".openModsFolder");
        if (openModsFolder) {
            this.trackClicks(openModsFolder, this.openModsFolder);
        }
        const browseMods = this.htmlElement.querySelector(".browseMods");
        if (browseMods) {
            this.trackClicks(browseMods, this.openBrowseMods);
        }

        const checkboxes = this.htmlElement.querySelectorAll(".checkbox");
        Array.from(checkboxes).forEach(checkbox => {
            this.trackClicks(checkbox, this.showModTogglingComingSoon);
        });
    }

    showModTogglingComingSoon() {
        this.dialogs.showWarning(T.mods.togglingComingSoon.title, T.mods.togglingComingSoon.description);
    }

    openModsFolder() {
        if (!G_IS_STANDALONE) {
            this.dialogs.showWarning(T.global.error, T.mods.folderOnlyStandalone);
            return;
        }
        ipcRenderer.invoke("open-mods-folder");
    }

    openBrowseMods() {
        this.app.platformWrapper.openExternalLink(THIRDPARTY_URLS.modBrowser);
    }

    onSteamLinkClicked() {
        openStandaloneLink(this.app, "shapez_modsettings");
        return false;
    }

    getDefaultPreviousState() {
        return "SettingsState";
    }
}
