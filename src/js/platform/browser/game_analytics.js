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

export class ShapezGameAnalytics extends GameAnalyticsInterface {
    constructor(app) {
        super(app);
        this.abtVariant = "0";
    }

    initialize() {}
}
