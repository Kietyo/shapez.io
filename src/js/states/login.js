import {GameState} from "../core/game_state";
import {HUDModalDialogs} from "../game/hud/parts/modal_dialogs";
import {T} from "../translations";

export class LoginState extends GameState {
    constructor() {
        super("LoginState");
    }

    getInnerHTML() {
        return `
        <div class="loadingImage"></div>
        <div class="loadingStatus">
            <span class="desc">${T.global.loggingIn}</span>
            </div>
        </div>
        <span class="prefab_GameHint"></span>
        `;
    }

    /**
     *
     * @param {object} payload
     * @param {string} payload.nextStateId
     */
    onEnter(payload) {
        this.payload = payload;
        if (!this.payload.nextStateId) {
            throw new Error("No next state id");
        }

        this.dialogs = new HUDModalDialogs(null, this.app);
        const dialogsElement = document.body.querySelector(".modalDialogParent");
        this.dialogs.initializeToElement(dialogsElement);

        this.htmlElement.classList.add("prefab_LoadingState");

        this.tryLogin();
    }

    tryLogin() {
        this.app.clientApi.tryLogin().then(success => {
            console.log("Logged in:", success);

            if (!success) {
                const signals = this.dialogs.showWarning(
                    T.dialogs.offlineMode.title,
                    T.dialogs.offlineMode.desc,
                    ["retry", "playOffline:bad"]
                );
                signals.retry.add(() => setTimeout(() => this.tryLogin(), 2000), this);
                signals.playOffline.add(this.finishLoading, this);
            } else {
                this.finishLoading();
            }
        });
    }

    finishLoading() {
        this.moveToState(this.payload.nextStateId);
    }

    update() {
    }

    onRender() {
        this.update();
    }

    onBackgroundTick() {
        this.update();
    }
}
