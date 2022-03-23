"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthersBridge = void 0;
const fireblocks_sdk_1 = require("fireblocks-sdk");
const base_bridge_1 = require("./base-bridge");
const utils_1 = require("ethers/lib/utils");
class EthersBridge extends base_bridge_1.BaseBridge {
    async sendTransaction(transaction, txNote) {
        var _a, _b;
        const txArguments = {
            operation: fireblocks_sdk_1.TransactionOperation.CONTRACT_CALL,
            assetId: this.assetId,
            source: {
                type: fireblocks_sdk_1.PeerType.VAULT_ACCOUNT,
                id: this.params.vaultAccountId
            },
            gasPrice: transaction.gasPrice != undefined ? utils_1.formatUnits(transaction.gasPrice.toString(), "gwei") : undefined,
            gasLimit: (_a = transaction.gasLimit) === null || _a === void 0 ? void 0 : _a.toString(),
            destination: {
                type: this.params.externalWalletId ? fireblocks_sdk_1.PeerType.EXTERNAL_WALLET : fireblocks_sdk_1.PeerType.ONE_TIME_ADDRESS,
                id: this.params.externalWalletId,
                oneTimeAddress: {
                    address: transaction.to
                }
            },
            note: txNote || '',
            amount: utils_1.formatEther(((_b = transaction.value) === null || _b === void 0 ? void 0 : _b.toString()) || "0"),
            extraParameters: {
                contractCallData: transaction.data
            }
        };
        return this.params.fireblocksApiClient.createTransaction(txArguments);
    }
}
exports.EthersBridge = EthersBridge;
