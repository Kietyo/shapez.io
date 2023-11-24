import {generateMatrixRotations} from "../../core/utils";
import {enumDirection, Vector} from "../../core/vector";
import {enumLogicGateType, LogicGateComponent} from "../components/logic_gate";
import {enumPinSlotType, WiredPinsComponent} from "../components/wired_pins";
import {Entity} from "../entity";
import {defaultBuildingVariant, MetaBuilding} from "../meta_building";
import {GameRoot} from "../root";
import {enumHubGoalRewards} from "../tutorial_goals";

export class MetaAnalyzerBuilding extends MetaBuilding {
    constructor() {
        super("analyzer");
    }

    static getAllVariantCombinations() {
        return [
            {
                internalId: 43,
                variant: defaultBuildingVariant,
            },
        ];
    }

    getSilhouetteColor() {
        return "#3a52bc";
    }

    /**
     * @param {GameRoot} root
     */
    getIsUnlocked(root) {
        return root.hubGoals.isRewardUnlocked(enumHubGoalRewards.reward_virtual_processing);
    }

    /** @returns {"wires"} **/
    getLayer() {
        return "wires";
    }

    getDimensions() {
        return new Vector(1, 1);
    }

    getRenderPins() {
        // We already have it included
        return false;
    }

    /**
     * Creates the entity at the given location
     * @param {Entity} entity
     */
    setupEntityComponents(entity) {
        entity.addComponent(
            new WiredPinsComponent({
                slots: [
                    {
                        pos: new Vector(0, 0),
                        direction: enumDirection.left,
                        type: enumPinSlotType.logicalEjector,
                    },
                    {
                        pos: new Vector(0, 0),
                        direction: enumDirection.right,
                        type: enumPinSlotType.logicalEjector,
                    },
                    {
                        pos: new Vector(0, 0),
                        direction: enumDirection.bottom,
                        type: enumPinSlotType.logicalAcceptor,
                    },
                ],
            })
        );

        entity.addComponent(
            new LogicGateComponent({
                type: enumLogicGateType.analyzer,
            })
        );
    }
}
