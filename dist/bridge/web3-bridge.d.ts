import { CreateTransactionResponse } from "fireblocks-sdk";
import { BaseBridge } from "./base-bridge";
import * as BN from "bn.js";
interface TransactionConfig {
    from?: string | number;
    to?: string;
    value?: number | string | BN;
    gas?: number | string;
    gasPrice?: number | string | BN;
    data?: string;
    nonce?: number;
    chainId?: number;
    chain?: string;
    hardfork?: string;
}
export declare class Web3Bridge extends BaseBridge {
    signTypedData(typedData: any, txNote: any): Promise<string>;
    sendTransaction(transaction: TransactionConfig, txNote?: string): Promise<CreateTransactionResponse>;
}
export {};
