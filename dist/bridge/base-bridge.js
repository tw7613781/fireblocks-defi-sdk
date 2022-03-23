"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseBridge = void 0;
const fireblocks_sdk_1 = require("fireblocks-sdk");
const chain_1 = require("../interfaces/chain");
const CHAIN_TO_ASSET_ID = {
    [chain_1.Chain.MAINNET]: 'ETH',
    [chain_1.Chain.ROPSTEN]: 'ETH_TEST',
    [chain_1.Chain.KOVAN]: 'ETH_TEST2',
    [chain_1.Chain.BSC]: 'BNB_BSC',
    [chain_1.Chain.BSC_TEST]: 'BNB_TEST',
    [chain_1.Chain.POLYGON]: 'MATIC_POLYGON',
    [chain_1.Chain.POLYGON_TEST]: 'MATIC_POLYGON_MUMBAI',
    [chain_1.Chain.SMARTBCH_TEST]: 'SMARTBCH_TEST',
    [chain_1.Chain.AVAX_TEST]: 'AVAXTEST'
};
const CHAIN_IDS = {
    [chain_1.Chain.MAINNET]: 1,
    [chain_1.Chain.ROPSTEN]: 3,
    [chain_1.Chain.KOVAN]: 42,
    [chain_1.Chain.BSC]: 56,
    [chain_1.Chain.BSC_TEST]: 97,
    [chain_1.Chain.POLYGON]: 137,
    [chain_1.Chain.POLYGON_TEST]: 80001,
    [chain_1.Chain.SMARTBCH_TEST]: 10001,
    [chain_1.Chain.AVAX_TEST]: 43113
};
class BaseBridge {
    constructor(params) {
        this.params = params;
        const chain = params.chain || chain_1.Chain.MAINNET;
        this.assetId = CHAIN_TO_ASSET_ID[chain];
    }
    async getDepositAddress() {
        const depositAddresses = await this.params.fireblocksApiClient.getDepositAddresses(this.params.vaultAccountId, this.assetId);
        return depositAddresses[0].address;
    }
    getChainId() {
        return CHAIN_IDS[this.params.chain];
    }
    async waitForTxHash(txId, timeoutMs) {
        return Promise.race([
            (async () => {
                let status;
                let txInfo;
                while (!BaseBridge.finalTransactionStates.includes(status)) {
                    try {
                        txInfo = await this.params.fireblocksApiClient.getTransactionById(txId);
                        status = txInfo.status;
                    }
                    catch (err) {
                        console.error(err);
                    }
                    if (txInfo.txHash) {
                        return txInfo.txHash;
                    }
                    await new Promise(r => setTimeout(r, 1000));
                }
                ;
                if (status != fireblocks_sdk_1.TransactionStatus.COMPLETED) {
                    throw `Transaction was not completed successfully. Final Status: ${status}`;
                }
                return txInfo.txHash;
            })(),
            new Promise((resolve, reject) => {
                if (timeoutMs) {
                    setTimeout(() => reject(`waitForTxCompletion() for txId ${txId} timed out`), timeoutMs);
                }
            })
        ]);
    }
}
exports.BaseBridge = BaseBridge;
BaseBridge.finalTransactionStates = [
    fireblocks_sdk_1.TransactionStatus.COMPLETED,
    fireblocks_sdk_1.TransactionStatus.FAILED,
    fireblocks_sdk_1.TransactionStatus.CANCELLED,
    fireblocks_sdk_1.TransactionStatus.BLOCKED,
    fireblocks_sdk_1.TransactionStatus.REJECTED
];
