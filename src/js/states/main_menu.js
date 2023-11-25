import {cachebust} from "../core/cachebust";
import {globalConfig, openStandaloneLink, THIRDPARTY_URLS} from "../core/config";
import {GameState} from "../core/game_state";
import {DialogWithForm} from "../core/modal_dialog_elements";
import {FormElementInput} from "../core/modal_dialog_forms";
import {ReadWriteProxy} from "../core/read_write_proxy";
import {WEB_STEAM_SSO_AUTHENTICATED} from "../core/steam_sso";
import {
    formatSecondsToTimeAgo,
    generateFileDownload,
    getLogoSprite,
    makeButton,
    makeDiv,
    makeDivElement,
    removeAllChildren,
    startFileChoose,
    waitNextFrame,
} from "../core/utils";
import {HUDModalDialogs} from "../game/hud/parts/modal_dialogs";
import {PlatformWrapperImplBrowser} from "../platform/browser/wrapper";
import {T} from "../translations";

const trim = require("trim");

/**
 * @typedef {import("../savegame/savegame_typedefs").SavegameMetadata} SavegameMetadata
 * @typedef {import("../profile/setting_types").EnumSetting} EnumSetting
 */

export class MainMenuState extends GameState {
    constructor() {
        super("MainMenuState");

        this.refreshInterval = null;
    }

    getInnerHTML() {
        const showExitAppButton = G_IS_STANDALONE;

        if (!G_IS_STANDALONE) {
            const wrapper = /** @type {PlatformWrapperImplBrowser} */ (this.app.platformWrapper);
        }

        const showShapez2 = true;

        const bannerHtml = `
            <div class="points">
                ${Array.from(Object.entries(T.ingame.standaloneAdvantages.points))
                    .slice(0, 6)
                    .map(
                        ([key, trans]) => `
                <div class="point ${key}">
                    <strong>${trans.title}</strong>
                    <p>${trans.desc}</p>
                </div>`
                    )
                    .join("")}

            </div>


            <a href="#" class="steamLink steam_dlbtn_0" target="_blank">
            ${
                globalConfig.currentDiscount > 0
                    ? `<span class='discount'>${T.global.discount.replace(
                          "<percentage>",
                          String(globalConfig.currentDiscount)
                      )}</span>`
                    : ""
            }
                Play shapez on Steam
            </a>
            ${`<div class="onlinePlayerCount"></div>`}

        `;

        return `
            <div class="topButtons">
                ${
                    `<button aria-label="Choose Language" class="languageChoose" data-languageicon="${this.app.settings.getLanguage()}"></button>`
                }

                <button class="settingsButton" aria-label="Settings"></button>
                ${showExitAppButton ? `<button class="exitAppButton" aria-label="Exit App"></button>` : ""}
            </div>


            <video autoplay muted loop class="fullscreenBackgroundVideo">
                <source src="${cachebust("res/bg_render.webm")}" type="video/webm">
            </video>

            <div class="logo">
                <img src="${cachebust("res/" + getLogoSprite())}" alt="shapez.io Logo"
                    width="${Math.round((710 / 3) * this.app.getEffectiveUiScale())}"
                    height="${Math.round((180 / 3) * this.app.getEffectiveUiScale())}"
                >
            </div>

            <div class="mainWrapper" data-columns="${1}">
                <div class="mainContainer">
                    <div class="buttons"></div>
                    <div class="savegamesMount"></div>
                    ${
                        (G_IS_STANDALONE || !WEB_STEAM_SSO_AUTHENTICATED)
                            ? `<div class="steamSso">
                                <span class="description">${
                                    G_IS_STANDALONE
                                        ? T.mainMenu.playFullVersionStandalone
                                        : T.mainMenu.playFullVersionV2
                                }</span>
                            </div>`
                            : ""
                    }
                    ${
                        WEB_STEAM_SSO_AUTHENTICATED
                            ? `
                            <div class="steamSso">
                                <span class="description">${T.mainMenu.playingFullVersion}</span>
                                <a class="ssoSignOut" href="?sso_logout_silent">${T.mainMenu.logout}</a>

                            </div>
                        `
                            : ""
                    }



                </div>

                <div class="sideContainer">
                    ${""}

                    ${
                        showShapez2
                            ? `<div class="mainNews shapez2">
                        <div class="text">We are currently prototyping Shapez 2!</div>

                    </div>`
                            : ""
                    }


                ${
                    ""
                }

                </div>


            </div>

            ${
                `

                <div class="footer ${""} ">

                    <div class="socialLinks">
                    ${
                            `<a class="patreonLink boxLink" target="_blank">
                                    <span class="thirdpartyLogo patreonLogo"></span>
                                    <span class="label">Patreon</span>
                                </a>`
                    }
                    ${
                        (!G_IS_STANDALONE)
                            ? `<a class="steamLinkSocial boxLink" target="_blank">
                                    <span class="thirdpartyLogo steamLogo"></span>
                                    <span class="label">steam</span>
                                </a>`
                            : ""
                    }
                    ${
                        `
                        <a class="githubLink boxLink" target="_blank">
                            <span class="thirdpartyLogo githubLogo"></span>
                            <span class="label">GitHub</span>
                        </a>`
                    }


                    ${
                        `<a class="discordLink boxLink" target="_blank">
                                    <span class="thirdpartyLogo  discordLogo"></span>
                                    <span class="label">Discord</span>
                                </a>`
                    }

                    ${
                            `<a class="redditLink boxLink" target="_blank">
                                    <span class="thirdpartyLogo redditLogo"></span>
                                    <span class="label">Reddit</span>
                                </a>`
                    }

                    ${
                        ""
                    }


                    </div>

                    <div class="footerGrow">
                        ${`<a class="changelog">${T.changelog.title}</a>`}

                        ${`<a class="helpTranslate">${T.mainMenu.helpTranslate}</a>`}

                    </div>
                        <div class="author"><a class="producerLink" href="https://tobspr.io" target="_blank" title="tobspr Games" rel="follow">
                        <img src="${cachebust("res/logo-tobspr-games.svg")}" alt="tobspr Games"
                        height="${25 * 0.8 * this.app.getEffectiveUiScale()}"
                        width="${82 * 0.8 * this.app.getEffectiveUiScale()}"
                        >

                    </a></div>

                </div>

            `
            }
        `;
    }

    /**
     * Asks the user to import a savegame
     */
    requestImportSavegame() {
        // Create a 'fake' file-input to accept savegames
        startFileChoose(".bin").then(file => {
            if (file) {
                const closeLoader = this.dialogs.showLoadingDialog();
                waitNextFrame().then(() => {
                    const reader = new FileReader();
                    reader.addEventListener("load", event => {
                        const contents = event.target.result;
                        let realContent;

                        try {
                            realContent = ReadWriteProxy.deserializeObject(contents);
                        } catch (err) {
                            closeLoader();
                            this.dialogs.showWarning(
                                T.dialogs.importSavegameError.title,
                                T.dialogs.importSavegameError.text + "<br><br>" + err
                            );
                            return;
                        }

                        this.app.savegameMgr.importSavegame(realContent).then(
                            () => {
                                closeLoader();
                                this.dialogs.showWarning(
                                    T.dialogs.importSavegameSuccess.title,
                                    T.dialogs.importSavegameSuccess.text
                                );

                                this.renderMainMenu();
                                this.renderSavegames();
                            },
                            err => {
                                closeLoader();
                                this.dialogs.showWarning(
                                    T.dialogs.importSavegameError.title,
                                    T.dialogs.importSavegameError.text + ":<br><br>" + err
                                );
                            }
                        );
                    });
                    reader.addEventListener("error", error => {
                        this.dialogs.showWarning(
                            T.dialogs.importSavegameError.title,
                            T.dialogs.importSavegameError.text + ":<br><br>" + error
                        );
                    });
                    reader.readAsText(file, "utf-8");
                });
            }
        });
    }

    onBackButton() {
        this.app.platformWrapper.exitApp();
    }

    onEnter(payload) {
        // Start loading already
        const app = this.app;
        setTimeout(() => app.backgroundResourceLoader.getIngamePromise(), 10);

        this.dialogs = new HUDModalDialogs(null, this.app);
        const dialogsElement = document.body.querySelector(".modalDialogParent");
        this.dialogs.initializeToElement(dialogsElement);

        if (payload.loadError) {
            this.dialogs.showWarning(
                T.dialogs.gameLoadFailure.title,
                T.dialogs.gameLoadFailure.text + "<br><br>" + payload.loadError
            );
        }

        if (G_IS_DEV && globalConfig.debug.fastGameEnter) {
            const games = this.app.savegameMgr.getSavegamesMetaData();
            if (games.length > 0 && globalConfig.debug.resumeGameOnFastEnter) {
                this.resumeGame(games[0]);
            } else {
                this.onPlayButtonClicked();
            }
        }

        // Initialize video
        this.videoElement = this.htmlElement.querySelector("video");
        this.videoElement.playbackRate = 0.9;
        this.videoElement.addEventListener("canplay", () => {
            if (this.videoElement) {
                this.videoElement.classList.add("loaded");
            }
        });

        const clickHandling = {
            ".settingsButton": this.onSettingsButtonClicked,
            ".languageChoose": this.onLanguageChooseClicked,
            ".redditLink": this.onRedditClicked,
            ".twitterLink": this.onTwitterLinkClicked,
            ".patreonLink": this.onPatreonLinkClicked,
            ".helpTranslate": this.onTranslationHelpLinkClicked,
            ".exitAppButton": this.onExitAppButtonClicked,
            ".steamLink": this.onSteamLinkClicked,
            ".steamLinkSocial": this.onSteamLinkClickedSocial,
            ".shapez2": this.onShapez2Clicked,
            ".discordLink": () => {
                this.app.platformWrapper.openExternalLink(THIRDPARTY_URLS.discord);
            },
            ".githubLink": () => {
                this.app.platformWrapper.openExternalLink(THIRDPARTY_URLS.github);
            },
        };

        for (const key in clickHandling) {
            const handler = clickHandling[key];
            const element = this.htmlElement.querySelector(key);
            if (element) {
                this.trackClicks(element, handler, { preventClick: true });
            }
        }

        this.renderMainMenu();
        this.renderSavegames();
    }

    renderMainMenu() {
        const buttonContainer = this.htmlElement.querySelector(".mainContainer .buttons");
        removeAllChildren(buttonContainer);

        const outerDiv = makeDivElement(null, ["outer"], null);

        // Import button
        this.trackClicks(
            makeButton(outerDiv, ["importButton", "styledButton"], T.mainMenu.importSavegame),
            this.requestImportSavegame
        );

        if (this.savedGames.length > 0) {
            // Continue game
            this.trackClicks(
                makeButton(buttonContainer, ["continueButton", "styledButton"], T.mainMenu.continue),
                this.onContinueButtonClicked
            );

            // New game
            this.trackClicks(
                makeButton(outerDiv, ["newGameButton", "styledButton"], T.mainMenu.newGame),
                this.onPlayButtonClicked
            );
        } else {
            // New game
            this.trackClicks(
                makeButton(buttonContainer, ["playButton", "styledButton"], T.mainMenu.play),
                this.onPlayButtonClicked
            );
        }

        this.htmlElement
            .querySelector(".mainContainer")
            .setAttribute("data-savegames", String(this.savedGames.length));

        buttonContainer.appendChild(outerDiv);
    }

    onShapez2Clicked() {
        this.app.platformWrapper.openExternalLink("https://tobspr.io/shapez-2?utm_medium=shapez");
    }
    onSteamLinkClicked() {
        openStandaloneLink(this.app, "shapez_mainmenu");
        return false;
    }

    onSteamLinkClickedSocial() {
        openStandaloneLink(this.app, "shapez_mainmenu_social");
        return false;
    }

    onExitAppButtonClicked() {
        this.app.platformWrapper.exitApp();
    }

    onRedditClicked() {
        this.app.platformWrapper.openExternalLink(THIRDPARTY_URLS.reddit);
    }

    onTwitterLinkClicked() {
        this.app.platformWrapper.openExternalLink(THIRDPARTY_URLS.twitter);
    }

    onPatreonLinkClicked() {
        this.app.platformWrapper.openExternalLink(THIRDPARTY_URLS.patreon);
    }

    onLanguageChooseClicked() {
        const setting = /** @type {EnumSetting} */ (this.app.settings.getSettingHandleById("language"));

        const { optionSelected } = this.dialogs.showOptionChooser(T.settings.labels.language.title, {
            active: this.app.settings.getLanguage(),
            options: setting.options.map(option => ({
                value: setting.valueGetter(option),
                text: setting.textGetter(option),
                desc: setting.descGetter(option),
                iconPrefix: setting.iconPrefix,
            })),
        });

        optionSelected.add(value => {
            this.app.settings.updateLanguage(value).then(() => {
                if (setting.restartRequired) {
                    if (this.app.platformWrapper.getSupportsRestart()) {
                        this.app.platformWrapper.performRestart();
                    } else {
                        this.dialogs.showInfo(
                            T.dialogs.restartRequired.title,
                            T.dialogs.restartRequired.text,
                            ["ok:good"]
                        );
                    }
                }

                if (setting.changeCb) {
                    setting.changeCb(this.app, value);
                }
            });

            // Update current icon
            this.htmlElement.querySelector("button.languageChoose").setAttribute("data-languageIcon", value);
        }, this);
    }

    get savedGames() {
        return this.app.savegameMgr.getSavegamesMetaData();
    }

    renderSavegames() {
        const oldContainer = this.htmlElement.querySelector(".mainContainer .savegames");
        if (oldContainer) {
            oldContainer.remove();
        }
        const games = this.savedGames;
        if (games.length > 0) {
            const parent = makeDiv(this.htmlElement.querySelector(".mainContainer .savegamesMount"), null, [
                "savegames",
            ]);

            for (let i = 0; i < games.length; ++i) {
                const elem = makeDiv(parent, null, ["savegame"]);

                makeDiv(
                    elem,
                    null,
                    ["playtime"],
                    formatSecondsToTimeAgo((new Date().getTime() - games[i].lastUpdate) / 1000.0)
                );

                makeDiv(
                    elem,
                    null,
                    ["level"],
                    games[i].level
                        ? T.mainMenu.savegameLevel.replace("<x>", "" + games[i].level)
                        : T.mainMenu.savegameLevelUnknown
                );

                const name = makeDiv(
                    elem,
                    null,
                    ["name"],
                    "<span>" + (games[i].name ? games[i].name : T.mainMenu.savegameUnnamed) + "</span>"
                );

                const deleteButton = document.createElement("button");
                deleteButton.classList.add("styledButton", "deleteGame");
                deleteButton.setAttribute("aria-label", "Delete");
                elem.appendChild(deleteButton);

                const downloadButton = document.createElement("button");
                downloadButton.classList.add("styledButton", "downloadGame");
                downloadButton.setAttribute("aria-label", "Download");
                elem.appendChild(downloadButton);

                    const renameButton = document.createElement("button");
                    renameButton.classList.add("styledButton", "renameGame");
                    renameButton.setAttribute("aria-label", "Rename Savegame");
                    name.appendChild(renameButton);
                    this.trackClicks(renameButton, () => this.requestRenameSavegame(games[i]));

                const resumeButton = document.createElement("button");
                resumeButton.classList.add("styledButton", "resumeGame");
                resumeButton.setAttribute("aria-label", "Resumee");
                elem.appendChild(resumeButton);

                this.trackClicks(deleteButton, () => this.deleteGame(games[i]));
                this.trackClicks(downloadButton, () => this.downloadGame(games[i]));
                this.trackClicks(resumeButton, () => this.resumeGame(games[i]));
            }
        } else {
            const parent = makeDiv(
                this.htmlElement.querySelector(".mainContainer .savegamesMount"),
                null,
                ["savegamesNone"],
                T.mainMenu.noActiveSavegames
            );
        }
    }

    /**
     * @param {SavegameMetadata} game
     */
    requestRenameSavegame(game) {
        const regex = /^[a-zA-Z0-9_\- ]{1,20}$/;

        const nameInput = new FormElementInput({
            id: "nameInput",
            label: null,
            placeholder: "",
            defaultValue: game.name || "",
            validator: val => val.match(regex) && trim(val).length > 0,
        });
        const dialog = new DialogWithForm({
            app: this.app,
            title: T.dialogs.renameSavegame.title,
            desc: T.dialogs.renameSavegame.desc,
            formElements: [nameInput],
            buttons: ["cancel:bad:escape", "ok:good:enter"],
        });
        this.dialogs.internalShowDialog(dialog);

        // When confirmed, save the name
        dialog.buttonSignals.ok.add(() => {
            game.name = trim(nameInput.getValue());
            this.app.savegameMgr.writeAsync();
            this.renderSavegames();
        });
    }

    /**
     * @param {SavegameMetadata} game
     */
    resumeGame(game) {
            const savegame = this.app.savegameMgr.getSavegameById(game.internalId);
            savegame
                .readAsync()
                .then(() => {
                    this.moveToState("InGameState", {
                        savegame,
                    });
                })

                .catch(err => {
                    this.dialogs.showWarning(
                        T.dialogs.gameLoadFailure.title,
                        T.dialogs.gameLoadFailure.text + "<br><br>" + err
                    );
                });
    }

    /**
     * @param {SavegameMetadata} game
     */
    deleteGame(game) {
        const signals = this.dialogs.showWarning(
            T.dialogs.confirmSavegameDelete.title,
            T.dialogs.confirmSavegameDelete.text
                .replace("<savegameName>", game.name || T.mainMenu.savegameUnnamed)
                .replace("<savegameLevel>", String(game.level)),
            ["cancel:good", "delete:bad:timeout"]
        );

        signals.delete.add(() => {
            this.app.savegameMgr.deleteSavegame(game).then(
                () => {
                    this.renderSavegames();
                    if (this.savedGames.length <= 0) this.renderMainMenu();
                },
                err => {
                    this.dialogs.showWarning(
                        T.dialogs.savegameDeletionError.title,
                        T.dialogs.savegameDeletionError.text + "<br><br>" + err
                    );
                }
            );
        });
    }

    /**
     * @param {SavegameMetadata} game
     */
    downloadGame(game) {
        const savegame = this.app.savegameMgr.getSavegameById(game.internalId);
        savegame.readAsync().then(() => {
            const data = ReadWriteProxy.serializeObject(savegame.currentData);
            const filename = (game.name || "unnamed") + ".bin";
            generateFileDownload(filename, data);
        });
    }
    onSettingsButtonClicked() {
        this.moveToState("SettingsState");
    }

    onTranslationHelpLinkClicked() {
        this.app.platformWrapper.openExternalLink(
            "https://github.com/tobspr-games/shapez.io/blob/master/translations"
        );
    }

    onPlayButtonClicked() {

        const savegame = this.app.savegameMgr.createNewSavegame();

            this.moveToState("InGameState", {
                savegame,
            });
    }
    onContinueButtonClicked() {
        let latestLastUpdate = 0;
        let latestInternalId;
        this.app.savegameMgr.currentData.savegames.forEach(saveGame => {
            if (saveGame.lastUpdate > latestLastUpdate) {
                latestLastUpdate = saveGame.lastUpdate;
                latestInternalId = saveGame.internalId;
            }
        });

        const savegame = this.app.savegameMgr.getSavegameById(latestInternalId);
        if (!savegame) {
            console.warn("No savegame to continue found:", this.app.savegameMgr.currentData.savegames);
            return;
        }

        savegame
            .readAsync()
            .then(() => {
                this.moveToState("InGameState", {
                    savegame,
                });
            });
    }

    onLeave() {
        this.dialogs.cleanup();
        clearInterval(this.refreshInterval);
    }
}
