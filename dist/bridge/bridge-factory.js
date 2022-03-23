"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BridgeFactory = void 0;
const ethers_bridge_1 = require("./ethers-bridge");
const web3_bridge_1 = require("./web3-bridge");
class BridgeFactory {
    constructor(params) {
        this.params = params;
    }
    ;
    createEthersBridge() {
        return new ethers_bridge_1.EthersBridge(this.params);
    }
    createWenBridge() {
        return new web3_bridge_1.Web3Bridge(this.params);
    }
}
exports.BridgeFactory = BridgeFactory;
