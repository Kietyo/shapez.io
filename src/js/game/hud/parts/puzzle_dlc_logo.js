import {makeDiv} from "../../../core/utils";
import {BaseHUDPart} from "../base_hud_part";

export class HUDPuzzleDLCLogo extends BaseHUDPart {
    createElements(parent) {
        this.element = makeDiv(parent, "ingame_HUD_PuzzleDLCLogo");
        this.element.classList.toggle("china", false);
        parent.appendChild(this.element);
    }

    initialize() {}

    next() {}
}
