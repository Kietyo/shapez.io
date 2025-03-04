import {globalConfig} from "./config";
import {epsilonCompare, round2Digits} from "./utils";
import {Vector} from "./vector";

export class Rectangle {
    constructor(x = 0, y = 0, w = 0, h = 0) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    /**
     * Creates a rectangle from top right bottom and left offsets
     * @param {number} top
     * @param {number} right
     * @param {number} bottom
     * @param {number} left
     */
    static fromTRBL(top, right, bottom, left) {
        return new Rectangle(left, top, right - left, bottom - top);
    }
    /**
     * Copies this instance
     * @returns {Rectangle}
     */
    clone() {
        return new Rectangle(this.x, this.y, this.w, this.h);
    }

    /**
     * Returns if this rectangle is empty
     * @returns {boolean}
     */
    isEmpty() {
        return epsilonCompare(this.w * this.h, 0);
    }

    /**
     * Returns if this rectangle is equal to the other while taking an epsilon into account
     * @param {Rectangle} other
     * @param {number} [epsilon]
     */
    equalsEpsilon(other, epsilon) {
        return (
            epsilonCompare(this.x, other.x, epsilon) &&
            epsilonCompare(this.y, other.y, epsilon) &&
            epsilonCompare(this.w, other.w, epsilon) &&
            epsilonCompare(this.h, other.h, epsilon)
        );
    }

    /**
     * @returns {number}
     */
    left() {
        return this.x;
    }

    /**
     * @returns {number}
     */
    right() {
        return this.x + this.w;
    }

    /**
     * @returns {number}
     */
    top() {
        return this.y;
    }

    /**
     * @returns {number}
     */
    bottom() {
        return this.y + this.h;
    }
    /**
     * Returns the center of the rect
     * @returns {Vector}
     */
    getCenter() {
        return new Vector(this.x + this.w / 2, this.y + this.h / 2);
    }
    /**
     * Moves the rectangle by the given parameters
     * @param {number} x
     * @param {number} y
     */
    moveBy(x, y) {
        this.x += x;
        this.y += y;
    }
    /**
     * Scales every parameter (w, h, x, y) by the given factor. Useful to transform from world to
     * tile space and vice versa
     * @param {number} factor
     */
    allScaled(factor) {
        return new Rectangle(this.x * factor, this.y * factor, this.w * factor, this.h * factor);
    }

    /**
     * Expands the rectangle in all directions
     * @param {number} amount
     * @returns {Rectangle} new rectangle
     */
    expandedInAllDirections(amount) {
        return new Rectangle(this.x - amount, this.y - amount, this.w + 2 * amount, this.h + 2 * amount);
    }

    /**
     * Returns if the given rectangle is contained
     * @param {Rectangle} rect
     * @returns {boolean}
     */
    containsRect(rect) {
        return (
            this.x <= rect.right() &&
            rect.x <= this.right() &&
            this.y <= rect.bottom() &&
            rect.y <= this.bottom()
        );
    }

    /**
     * Returns if this rectangle contains the other rectangle specified by the parameters
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @returns {boolean}
     */
    containsRect4Params(x, y, w, h) {
        return this.x <= x + w && x <= this.right() && this.y <= y + h && y <= this.bottom();
    }

    /**
     * Returns if the rectangle contains the given circle at (x, y) with the radius (radius)
     * @param {number} x
     * @param {number} y
     * @param {number} radius
     * @returns {boolean}
     */
    containsCircle(x, y, radius) {
        return (
            this.x <= x + radius &&
            x - radius <= this.right() &&
            this.y <= y + radius &&
            y - radius <= this.bottom()
        );
    }

    /**
     * Returns if the rectangle contains the given point
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    containsPoint(x, y) {
        return x >= this.x && x < this.right() && y >= this.y && y < this.bottom();
    }

    /**
     * Returns the shared area with another rectangle, or null if there is no intersection
     * @param {Rectangle} rect
     * @returns {Rectangle|null}
     */
    getIntersection(rect) {
        const left = Math.max(this.x, rect.x);
        const top = Math.max(this.y, rect.y);

        const right = Math.min(this.x + this.w, rect.x + rect.w);
        const bottom = Math.min(this.y + this.h, rect.y + rect.h);

        if (right <= left || bottom <= top) {
            return null;
        }

        return Rectangle.fromTRBL(top, right, bottom, left);
    }

    /**
     * Returns whether the rectangle fully intersects the given rectangle
     * @param {Rectangle} rect
     */
    intersectsFully(rect) {
        const intersection = this.getIntersection(rect);
        return intersection && Math.abs(intersection.w * intersection.h - rect.w * rect.h) < 0.001;
    }

    /**
     * Returns the union of this rectangle with another
     * @param {Rectangle} rect
     */
    getUnion(rect) {
        if (this.isEmpty()) {
            // If this is rect is empty, return the other one
            return rect.clone();
        }
        if (rect.isEmpty()) {
            // If the other is empty, return this one
            return this.clone();
        }

        // Find contained area
        const left = Math.min(this.x, rect.x);
        const top = Math.min(this.y, rect.y);
        const right = Math.max(this.right(), rect.right());
        const bottom = Math.max(this.bottom(), rect.bottom());

        return Rectangle.fromTRBL(top, right, bottom, left);
    }
    /**
     * Good for printing stuff
     */
    toString() {
        return (
            "[x:" +
            round2Digits(this.x) +
            "| y:" +
            round2Digits(this.y) +
            "| w:" +
            round2Digits(this.w) +
            "| h:" +
            round2Digits(this.h) +
            "]"
        );
    }

    /**
     * Returns a new rectangle in tile space which includes all tiles which are visible in this rect
     * @returns {Rectangle}
     */
    toTileCullRectangle() {
        return new Rectangle(
            Math.floor(this.x / globalConfig.tileSize),
            Math.floor(this.y / globalConfig.tileSize),
            Math.ceil(this.w / globalConfig.tileSize),
            Math.ceil(this.h / globalConfig.tileSize)
        );
    }
}
