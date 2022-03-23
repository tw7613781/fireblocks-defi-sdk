import { BridgeParams } from "../interfaces/bridge-params";
import { EthersBridge } from "./ethers-bridge";
import { Web3Bridge } from "./web3-bridge";
export declare class BridgeFactory {
    readonly params: BridgeParams;
    constructor(params: BridgeParams);
    createEthersBridge(): EthersBridge;
    createWenBridge(): Web3Bridge;
}
