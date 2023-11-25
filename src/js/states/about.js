import {TextualGameState} from "../core/textual_game_state";
import {T} from "../translations";
import {THIRDPARTY_URLS} from "../core/config";
import {cachebust} from "../core/cachebust";
import {getLogoSprite} from "../core/utils";

export class AboutState extends TextualGameState {
    constructor() {
        super("AboutState");
    }

    getStateHeaderTitle() {
        return T.about.title;
    }

    getMainContentHTML() {
        return `
            <div class="head">
                <img src="${cachebust("res/" + getLogoSprite())}" alt="shapez.io Logo">
            </div>
            <div class="text">
            ${T.about.body
            .replace("<githublink>", THIRDPARTY_URLS.github)
            .replace("<discordlink>", THIRDPARTY_URLS.discord)}
            </div>
        `;
    }

    getDefaultPreviousState() {
        return "SettingsState";
    }
}
