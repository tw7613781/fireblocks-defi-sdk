import { TransactionStatus } from "fireblocks-sdk";
import { BridgeParams } from "../interfaces/bridge-params";
export declare abstract class BaseBridge {
    readonly params: BridgeParams;
    readonly assetId: string;
    static readonly finalTransactionStates: TransactionStatus[];
    constructor(params: BridgeParams);
    getDepositAddress(): Promise<string>;
    getChainId(): number;
    waitForTxHash(txId: string, timeoutMs?: number): Promise<string>;
}
