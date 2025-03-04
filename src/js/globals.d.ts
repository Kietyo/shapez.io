// Globals defined by webpack

declare const G_IS_DEV: boolean;
declare function assert(condition: boolean | object | string, ...errorMessage: string[]): void;
declare function assertAlways(condition: boolean | object | string, ...errorMessage: string[]): void;

declare const abstract: void;

declare const G_APP_ENVIRONMENT: string;
declare const G_HAVE_ASSERT: boolean;
declare const G_BUILD_TIME: number;
declare const G_IS_STANDALONE: boolean;
declare const G_IS_BROWSER: boolean;

declare const G_BUILD_COMMIT_HASH: string;
declare const G_BUILD_VERSION: string;
declare const G_ALL_UI_IMAGES: Array<string>;
declare const G_IS_RELEASE: boolean;

declare const shapez: any;

declare const ipcRenderer: any;

// Polyfills
declare interface String {
    replaceAll(search: string, replacement: string): string;
}

declare interface CanvasRenderingContext2D {
    beginRoundedRect(x: number, y: number, w: number, h: number, r: number): void;
    beginCircle(x: number, y: number, r: number): void;

    msImageSmoothingEnabled: boolean;
    mozImageSmoothingEnabled: boolean;
    webkitImageSmoothingEnabled: boolean;
}

// FontFace
declare interface Document {
    fonts: any;
}

declare interface Object {
    entries(obj: object): Array<[string, any]>;
}

declare interface Math {
    radians(number): number;
    degrees(number): number;
}

declare type Class<T = unknown> = new (...args: any[]) => T;

declare interface String {
    padStart(size: number, fill?: string): string;
    padEnd(size: number, fill: string): string;
}

declare interface FactoryTemplate<T> {
    entries: Array<Class<T>>;
    entryIds: Array<string>;
    idToEntry: any;

    getId(): string;
    getAllIds(): Array<string>;
    register(entry: Class<T>): void;
    hasId(id: string): boolean;
    findById(id: string): Class<T>;
    getEntries(): Array<Class<T>>;
    getNumEntries(): number;
}

declare class TypedTrackedState<T> {
    constructor(callbackMethod?: (value: T) => void, callbackScope?: any);

    set(value: T, changeHandler?: (value: T) => void, changeScope?: any): void;
    get(): T;
}

declare const STOP_PROPAGATION = "stop_propagation";

declare interface TypedSignal<T extends Array<any>> {
    add(receiver: (...args: T) => /* STOP_PROPAGATION */ string | void, scope?: object);
    addToTop(receiver: (...args: T) => /* STOP_PROPAGATION */ string | void, scope?: object);
    remove(receiver: (...args: T) => /* STOP_PROPAGATION */ string | void);

    dispatch(...args: T): /* STOP_PROPAGATION */ string | void;

    removeAll();
}

declare type Layer = "regular" | "wires";
declare type ItemType = "shape" | "color" | "boolean";

declare module "worker-loader?inline=true&fallback=false!*" {
    class WebpackWorker extends Worker {
        constructor();
    }

    export default WebpackWorker;
}
