"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Web3Bridge = void 0;
const fireblocks_sdk_1 = require("fireblocks-sdk");
const base_bridge_1 = require("./base-bridge");
const utils_1 = require("ethers/lib/utils");
const eth_sig_util_1 = require("eth-sig-util");
class Web3Bridge extends base_bridge_1.BaseBridge {
    async signTypedData(typedData, txNote) {
        const content = eth_sig_util_1.TypedDataUtils.sign(typedData).toString("hex");
        const transactionParams = {
            operation: fireblocks_sdk_1.TransactionOperation.RAW,
            assetId: this.assetId,
            source: {
                type: fireblocks_sdk_1.PeerType.VAULT_ACCOUNT,
                id: this.params.vaultAccountId
            },
            note: txNote || '',
            extraParameters: {
                rawMessageData: {
                    messages: [{
                            content
                        }]
                }
            }
        };
        const { id, status } = await this.params.fireblocksApiClient.createTransaction(transactionParams);
        let txInfo;
        let currentStatus = status;
        while (!base_bridge_1.BaseBridge.finalTransactionStates.includes(currentStatus)) {
            try {
                txInfo = await this.params.fireblocksApiClient.getTransactionById(id);
                currentStatus = txInfo.status;
            }
            catch (err) {
                console.log("error:", err);
            }
            await new Promise(r => setTimeout(r, 1000));
        }
        ;
        if (currentStatus != fireblocks_sdk_1.TransactionStatus.COMPLETED) {
            throw new Error(`Transaction was not completed successfully. Final Status: ${currentStatus}`);
        }
        const sig = txInfo.signedMessages[0].signature;
        const v = 27 + sig.v;
        return "0x" + sig.r + sig.s + v.toString(16);
    }
    async sendTransaction(transaction, txNote) {
        var _a, _b;
        if (transaction.chainId && transaction.chainId != this.getChainId()) {
            throw new Error(`Chain ID of the transaction (${transaction.chainId}) does not match the chain ID of the connected account (${this.getChainId()})`);
        }
        return this.params.fireblocksApiClient.createTransaction({
            operation: fireblocks_sdk_1.TransactionOperation.CONTRACT_CALL,
            assetId: this.assetId,
            source: {
                type: fireblocks_sdk_1.PeerType.VAULT_ACCOUNT,
                id: this.params.vaultAccountId
            },
            gasPrice: transaction.gasPrice != undefined ? utils_1.formatUnits(transaction.gasPrice.toString(), "gwei") : undefined,
            gasLimit: (_a = transaction.gas) === null || _a === void 0 ? void 0 : _a.toString(),
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
        });
    }
}
exports.Web3Bridge = Web3Bridge;
