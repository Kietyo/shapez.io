import {createLogger} from "../core/logging";
import {DialogWithForm} from "../core/modal_dialog_elements";
import {FormElementInput} from "../core/modal_dialog_forms";
import {TextualGameState} from "../core/textual_game_state";
import {formatBigNumberFull} from "../core/utils";
import {enumGameModeIds} from "../game/game_mode";
import {ShapeDefinition} from "../game/shape_definition";
import {MUSIC} from "../platform/sound";
import {Savegame} from "../savegame/savegame";
import {T} from "../translations";

const navigation = {
    categories: ["official", "top-rated", "trending", "trending-weekly", "new"],
    difficulties: ["easy", "medium", "hard"],
    account: ["mine", "completed"],
    search: ["search"],
};

const logger = createLogger("puzzle-menu");

let lastCategory = "official";

let lastSearchOptions = {
    searchTerm: "",
    difficulty: "any",
    duration: "any",
    includeCompleted: false,
};