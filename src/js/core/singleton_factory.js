import {createLogger} from "./logging";

const logger = createLogger("singleton_factory");

// simple factory pattern
export class SingletonFactory {
    constructor(id) {
        this.id = id;

        // Store array as well as dictionary, to speed up lookups
        this.entries = [];
        this.idToEntry = {};
    }

    getId() {
        return this.id;
    }

    register(classHandle) {
        // First, construct instance
        const instance = new classHandle();

        // Extract id
        const id = instance.getId();
        assert(id, "Factory: Invalid id for class " + classHandle.name + ": " + id);

        // Check duplicates
        assert(!this.idToEntry[id], "Duplicate factory entry for " + id);

        // Insert
        this.entries.push(instance);
        this.idToEntry[id] = instance;
    }

    /**
     * Finds an instance by its constructor (The class handle)
     * @param {object} classHandle
     * @returns {object}
     */
    findByClass(classHandle) {
        for (let i = 0; i < this.entries.length; ++i) {
            if (this.entries[i] instanceof classHandle) {
                return this.entries[i];
            }
        }
        assert(false, "Factory: Object not found by classHandle (classid: " + classHandle.name + ")");
        return null;
    }

    /**
     * Returns amount of stored entries
     * @returns {number}
     */
    getNumEntries() {
        return this.entries.length;
    }
}
