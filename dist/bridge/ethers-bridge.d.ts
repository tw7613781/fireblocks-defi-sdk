import { Deferrable } from "@ethersproject/properties";
import { CreateTransactionResponse } from "fireblocks-sdk";
import { PopulatedTransaction } from "ethers";
import { BaseBridge } from "./base-bridge";
export declare class EthersBridge extends BaseBridge {
    sendTransaction(transaction: Deferrable<PopulatedTransaction>, txNote?: string): Promise<CreateTransactionResponse>;
}
