import { globalConfig } from "../../core/config";
import { createLogger } from "../../core/logging";
import { queryParamOptions } from "../../core/query_parameters";
import { randomInt } from "../../core/utils";
import { BeltComponent } from "../../game/components/belt";
import { StaticMapEntityComponent } from "../../game/components/static_map_entity";
import { RegularGameMode } from "../../game/modes/regular";
import { GameRoot } from "../../game/root";
import { InGameState } from "../../states/ingame";
import { SteamAchievementProvider } from "../electron/steam_achievement_provider";
import { GameAnalyticsInterface } from "../game_analytics";
import { FILE_NOT_FOUND } from "../storage";
import { WEB_STEAM_SSO_AUTHENTICATED } from "../../core/steam_sso";

const logger = createLogger("game_analytics");

const analyticsUrl = G_IS_DEV ? "http://localhost:8001" : "https://analytics.shapez.io";

// Be sure to increment the ID whenever it changes
const analyticsLocalFile = G_IS_STEAM_DEMO ? "shapez_token_steamdemo.bin" : "shapez_token_123.bin";

const CURRENT_ABT = "abt_bsl2";
const CURRENT_ABT_COUNT = 1;

export class ShapezGameAnalytics extends GameAnalyticsInterface {
    constructor(app) {
        super(app);
        this.abtVariant = "0";
    }

    get environment() {
        if (G_IS_DEV) {
            return "dev";
        }

        if (G_IS_STEAM_DEMO) {
            return "steam-demo";
        }

        if (G_IS_STANDALONE) {
            return "steam";
        }

        if (WEB_STEAM_SSO_AUTHENTICATED) {
            return "prod-full";
        }

        if (G_IS_RELEASE) {
            return "prod";
        }

        if (window.location.host.indexOf("alpha") >= 0) {
            return "alpha";
        } else {
            return "beta";
        }
    }

    initialize() {}

    /**
     * Returns true if the shape is interesting
     * @param {GameRoot} root
     * @param {string} key
     */
    isInterestingShape(root, key) {
        if (key === root.gameMode.getBlueprintShapeKey()) {
            return true;
        }

        // Check if its a story goal
        const levels = root.gameMode.getLevelDefinitions();
        for (let i = 0; i < levels.length; ++i) {
            if (key === levels[i].shape) {
                return true;
            }
        }

        // Check if its required to unlock an upgrade
        const upgrades = root.gameMode.getUpgrades();
        for (const upgradeKey in upgrades) {
            const upgradeTiers = upgrades[upgradeKey];
            for (let i = 0; i < upgradeTiers.length; ++i) {
                const tier = upgradeTiers[i];
                const required = tier.required;
                for (let k = 0; k < required.length; ++k) {
                    if (required[k].shape === key) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    /**
     * Generates a game dump
     * @param {GameRoot} root
     */
    generateGameDump(root) {
        const shapeIds = Object.keys(root.hubGoals.storedShapes).filter(key =>
            this.isInterestingShape(root, key)
        );
        let shapes = {};
        for (let i = 0; i < shapeIds.length; ++i) {
            shapes[shapeIds[i]] = root.hubGoals.storedShapes[shapeIds[i]];
        }
        return {
            shapes,
            upgrades: root.hubGoals.upgradeLevels,
            belts: root.entityMgr.getAllWithComponent(BeltComponent).length,
            buildings:
                root.entityMgr.getAllWithComponent(StaticMapEntityComponent).length -
                root.entityMgr.getAllWithComponent(BeltComponent).length,
        };
    }
}
