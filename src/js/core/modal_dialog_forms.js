import {BaseItem} from "../game/base_item";
import {ClickDetector} from "./click_detector";
import {Signal} from "./signal";

/*
 * ***************************************************
 *
 *  LEGACY CODE WARNING
 *
 *  This is old code from yorg3.io and needs to be refactored
 *  @TODO
 *
 * ***************************************************
 */

export class FormElement {
    constructor(id, label) {
        this.id = id;
        this.label = label;

        this.valueChosen = new Signal();
    }

    getHtml() {
        abstract;
        return "";
    }

    getFormElement(parent) {
        return parent.querySelector("[data-formId='" + this.id + "']");
    }

    bindEvents(parent, clickTrackers) {
        abstract;
    }

    focus() {}

    isValid() {
        return true;
    }

    /** @returns {any} */
    getValue() {
        abstract;
    }
}

export class FormElementInput extends FormElement {
    constructor({ id, label = null, placeholder, defaultValue = "", inputType = "text", validator = null }) {
        super(id, label);
        this.placeholder = placeholder;
        this.defaultValue = defaultValue;
        this.inputType = inputType;
        this.validator = validator;

        this.element = null;
    }

    getHtml() {
        let classes = [];
        let inputType = "text";
        let maxlength = 256;
        switch (this.inputType) {
            case "text": {
                classes.push("input-text");
                break;
            }

            case "email": {
                classes.push("input-email");
                inputType = "email";
                break;
            }

            case "token": {
                classes.push("input-token");
                inputType = "text";
                maxlength = 4;
                break;
            }
        }

        return `
            <div class="formElement input">
                ${this.label ? `<label>${this.label}</label>` : ""}
                <input
                    type="${inputType}"
                    value="${this.defaultValue.replace(/["\\]+/gi, "")}"
                    maxlength="${maxlength}"
                    autocomplete="off"
                    autocorrect="off"
                    autocapitalize="off"
                    spellcheck="false"
                    class="${classes.join(" ")}"
                    placeholder="${this.placeholder.replace(/["\\]+/gi, "")}"
                    data-formId="${this.id}">
            </div>
        `;
    }

    bindEvents(parent, clickTrackers) {
        this.element = this.getFormElement(parent);
        this.element.addEventListener("input", event => this.updateErrorState());
        this.updateErrorState();
    }

    updateErrorState() {
        this.element.classList.toggle("errored", !this.isValid());
    }

    isValid() {
        return !this.validator || this.validator(this.element.value);
    }

    getValue() {
        return this.element.value;
    }
    focus() {
        this.element.focus();
        this.element.select();
    }
}
export class FormElementItemChooser extends FormElement {
    /**
     *
     * @param {object} param0
     * @param {string} param0.id
     * @param {string=} param0.label
     * @param {Array<BaseItem>} param0.items
     */
    constructor({ id, label, items = [] }) {
        super(id, label);
        this.items = items;
        this.element = null;

        /**
         * @type {BaseItem}
         */
        this.chosenItem = null;
    }

    getHtml() {
        let classes = [];

        return `
            <div class="formElement">
                ${this.label ? `<label>${this.label}</label>` : ""}
                <div class="ingameItemChooser input" data-formId="${this.id}"></div>
            </div>
            `;
    }

    /**
     * @param {HTMLElement} parent
     * @param {Array<ClickDetector>} clickTrackers
     */
    bindEvents(parent, clickTrackers) {
        this.element = this.getFormElement(parent);

        for (let i = 0; i < this.items.length; ++i) {
            const item = this.items[i];

            const canvas = document.createElement("canvas");
            canvas.width = 128;
            canvas.height = 128;
            const context = canvas.getContext("2d");
            item.drawFullSizeOnCanvas(context, 128);
            this.element.appendChild(canvas);

            const detector = new ClickDetector(canvas, {});
            clickTrackers.push(detector);
            detector.click.add(() => {
                this.chosenItem = item;
                this.valueChosen.dispatch(item);
            });
        }
    }

    isValid() {
        return true;
    }

    getValue() {
        return null;
    }

    focus() {}
}
