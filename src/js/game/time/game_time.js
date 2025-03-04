/* typehints:start */
import {GameRoot} from "../root";
/* typehints:end */
import {BasicSerializableObject, types} from "../../savegame/serialization";
import {RegularGameSpeed} from "./regular_game_speed";
import {BaseGameSpeed} from "./base_game_speed";
import {gGameSpeedRegistry} from "../../core/global_registries";
import {globalConfig} from "../../core/config";
import {createLogger} from "../../core/logging";

const logger = createLogger("game_time");

export class GameTime extends BasicSerializableObject {
    /**
     * @param {GameRoot} root
     */
    constructor(root) {
        super();
        this.root = root;

        // Current ingame time seconds, not incremented while paused
        this.timeSeconds = 0;

        // Current "realtime", a timer which always is incremented no matter whether the game is paused or no
        this.realtimeSeconds = 0;

        // The adjustment, used when loading savegames so we can continue where we were
        this.realtimeAdjust = 0;

        /** @type {BaseGameSpeed} */
        this.speed = new RegularGameSpeed(this.root);

        // Store how much time we have in bucket
        this.logicTimeBudget = 0;
    }

    static getId() {
        return "GameTime";
    }

    static getSchema() {
        return {
            timeSeconds: types.float,
            speed: types.obj(gGameSpeedRegistry),
            realtimeSeconds: types.float,
        };
    }

    /**
     * Fetches the new "real" time, called from the core once per frame, since performance now() is kinda slow
     */
    updateRealtimeNow() {
        this.realtimeSeconds = performance.now() / 1000.0 + this.realtimeAdjust;
    }
    /**
     * Internal method to generate new logic time budget
     * @param {number} deltaMs
     */
    internalAddDeltaToBudget(deltaMs) {
        // Only update if game is supposed to update
        if (this.root.hud.shouldPauseGame()) {
            this.logicTimeBudget = 0;
        } else {
            const multiplier = this.getSpeed().getTimeMultiplier();
            this.logicTimeBudget += deltaMs * multiplier;
        }

        // Check for too big pile of updates -> reduce it to 1
        let maxLogicSteps = Math.max(
            3,
            (this.speed.getMaxLogicStepsInQueue() * this.root.dynamicTickrate.currentTickRate) / 60
        );
        if (G_IS_DEV && globalConfig.debug.framePausesBetweenTicks) {
            maxLogicSteps *= 1 + globalConfig.debug.framePausesBetweenTicks;
        }

        if (this.logicTimeBudget > this.root.dynamicTickrate.deltaMs * maxLogicSteps) {
            this.logicTimeBudget = this.root.dynamicTickrate.deltaMs * maxLogicSteps;
        }
    }

    /**
     * Performs update ticks based on the queued logic budget
     * @param {number} deltaMs
     * @param {function():boolean} updateMethod
     */
    performTicks(deltaMs, updateMethod) {
        this.internalAddDeltaToBudget(deltaMs);

        const speedAtStart = this.root.time.getSpeed();

        let effectiveDelta = this.root.dynamicTickrate.deltaMs;
        if (G_IS_DEV && globalConfig.debug.framePausesBetweenTicks) {
            effectiveDelta += globalConfig.debug.framePausesBetweenTicks * this.root.dynamicTickrate.deltaMs;
        }

        // Update physics & logic
        while (this.logicTimeBudget >= effectiveDelta) {
            this.logicTimeBudget -= effectiveDelta;

            if (!updateMethod()) {
                // Gameover happened or so, do not update anymore
                return;
            }

            // Step game time
            this.timeSeconds += this.root.dynamicTickrate.deltaSeconds;

            // Game time speed changed, need to abort since our logic steps are no longer valid
            if (speedAtStart.getId() !== this.speed.getId()) {
                logger.warn(
                    "Skipping update because speed changed from",
                    speedAtStart.getId(),
                    "to",
                    this.speed.getId()
                );
                break;
            }
        }
    }

    /**
     * Returns ingame time in seconds
     * @returns {number} seconds
     */
    now() {
        return this.timeSeconds;
    }

    /**
     * Returns "real" time in seconds
     * @returns {number} seconds
     */
    realtimeNow() {
        return this.realtimeSeconds;
    }

    /**
     * Returns "real" time in seconds
     * @returns {number} seconds
     */
    systemNow() {
        return (this.realtimeSeconds - this.realtimeAdjust) * 1000.0;
    }
    getSpeed() {
        return this.speed;
    }
    deserialize(data) {
        const errorCode = super.deserialize(data);
        if (errorCode) {
            return errorCode;
        }

        // Adjust realtime now difference so they match
        this.realtimeAdjust = this.realtimeSeconds - performance.now() / 1000.0;
        this.updateRealtimeNow();

        this.speed.initializeAfterDeserialize(this.root);
    }
}
