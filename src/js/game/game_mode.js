/* typehints:start */
import {GameRoot} from "./root";
/* typehints:end */
import {Rectangle} from "../core/rectangle";
import {gGameModeRegistry} from "../core/global_registries";
import {BasicSerializableObject} from "../savegame/serialization";
import {MetaBuilding} from "./meta_building";
import {MetaItemProducerBuilding} from "./buildings/item_producer";
import {BaseHUDPart} from "./hud/base_hud_part";

/** @enum {string} */
export const enumGameModeIds = {
    regular: "regularMode",
};
export class GameMode extends BasicSerializableObject {
    /** @returns {string} */
    static getId() {
        abstract;
        return "unknownMode";
    }
    /**
     * @param {GameRoot} root
     * @param {string} [id=Regular]
     * @param {object|undefined} payload
     */
    static create(root, id = enumGameModeIds.regular, payload = undefined) {
        return new (gGameModeRegistry.findById(id))(root, payload);
    }

    /**
     * @param {GameRoot} root
     */
    constructor(root) {
        super();
        this.root = root;

        /**
         * @type {Record<string, typeof BaseHUDPart>}
         */
        this.additionalHudParts = {};

        /** @type {typeof MetaBuilding[]} */
        this.hiddenBuildings = [MetaItemProducerBuilding];
    }

    /** @returns {object} */
    serialize() {
        return {
            $: this.getId(),
            data: super.serialize(),
        };
    }

    /** @param {object} savedata */
    deserialize({ data }) {
        super.deserialize(data, this.root);
    }

    /** @returns {string} */
    getId() {
        // @ts-ignore
        return this.constructor.getId();
    }
    /**
     * @param {typeof MetaBuilding} building - Class name of building
     * @returns {boolean}
     */
    isBuildingExcluded(building) {
        return this.hiddenBuildings.indexOf(building) >= 0;
    }

    /** @returns {undefined|Rectangle[]} */
    getBuildableZones() {

    }

    /** @returns {Rectangle|undefined} */
    getCameraBounds() {

    }

    /** @returns {boolean} */
    hasHub() {
        return true;
    }

    /** @returns {boolean} */
    hasResources() {
        return true;
    }

    /** @returns {boolean} */
    hasAchievements() {
        return false;
    }

    /** @returns {number} */
    getMinimumZoom() {
        return 0.06;
    }

    /** @returns {number} */
    getMaximumZoom() {
        return 3.5;
    }

    /** @returns {Object<string, Array>} */
    getUpgrades() {
        return {
            belt: [],
            miner: [],
            processors: [],
            painting: [],
        };
    }

    throughputDoesNotMatter() {
        return false;
    }
    /** @returns {array} */
    getLevelDefinitions() {
        return [];
    }

    /** @returns {boolean} */
    getIsFreeplayAvailable() {
        return false;
    }

    /** @returns {boolean} */
    getIsSaveable() {
        return true;
    }

    /** @returns {boolean} */
    getHasFreeCopyPaste() {
        return false;
    }

    /** @returns {boolean} */
    getSupportsWires() {
        return true;
    }

    /** @returns {boolean} */
    getIsEditor() {
        return false;
    }

    /** @returns {boolean} */
    getIsDeterministic() {
        return false;
    }

    /** @returns {number | undefined} */
    getFixedTickrate() {

    }

    /** @returns {string} */
    getBlueprintShapeKey() {
        return "CbCbCbRb:CwCwCwCw";
    }
}
