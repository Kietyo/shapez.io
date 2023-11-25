import {Component} from "../component";

export class WireTunnelComponent extends Component {
    constructor() {
        super();

        /**
         * Linked network, only if its not multiple directions
         * @type {Array<import("../systems/wire").WireNetwork>}
         */
        this.linkedNetworks = [];
    }

    static getId() {
        return "WireTunnel";
    }
}
