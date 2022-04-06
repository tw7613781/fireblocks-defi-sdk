const { FireblocksSDK } = require("fireblocks-sdk");
const { EthersBridge, Chain } = require("fireblocks-defi-sdk");
const { ethers } = require("ethers");
const fs = require("fs");
require('dotenv').config();

const CHAIN = Chain.ROPSTEN;
const CONTRACT_ADDRESS = "0x2702e7E803349270F2f43e9A2dF33057954F62f9";
const CONTRACT_ABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "prevAdmin",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "currAdmin",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "distributor",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "CallDistribute",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "distributor",
          "type": "address"
        }
      ],
      "name": "AddDistributor",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "distributor",
          "type": "address"
        }
      ],
      "name": "RemoveDistributor",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "prevPayoutAddr",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "currPayoutAddr",
          "type": "address"
        }
      ],
      "name": "UpdatePayoutAddr",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "sender",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "transferTo",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "RevertTransfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "name": "_payout",
          "type": "address"
        },
        {
          "name": "_flex",
          "type": "address"
        },
        {
          "name": "_name",
          "type": "string"
        }
      ],
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "gas": 65838,
      "inputs": [],
      "name": "distribute",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "gas": 39484,
      "inputs": [
        {
          "name": "_addr",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "gas": 38457,
      "inputs": [
        {
          "name": "_addr",
          "type": "address"
        }
      ],
      "name": "addDistributor",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "gas": 23487,
      "inputs": [
        {
          "name": "_addr",
          "type": "address"
        }
      ],
      "name": "removeDistributor",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "gas": 39574,
      "inputs": [
        {
          "name": "_addr",
          "type": "address"
        }
      ],
      "name": "updatePayoutAddr",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "name": "_addr",
          "type": "address"
        },
        {
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "revertTransfer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "gas": 1268,
      "inputs": [],
      "name": "admin",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "gas": 1298,
      "inputs": [],
      "name": "payout",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "gas": 1328,
      "inputs": [],
      "name": "flex",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "gas": 7688,
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "gas": 1603,
      "inputs": [
        {
          "name": "arg0",
          "type": "address"
        }
      ],
      "name": "isDistributor",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]


async function processTransaction(bridge, tx) {
    const res = await bridge.sendTransaction(tx);

    console.log("Waiting for the transaction to be signed and mined");

    const txHash = await bridge.waitForTxHash(res.id);

    console.log(`Transaction ${res.id} has been broadcast. TX Hash is ${txHash}`);
}

(async function() {
    const apiSecret = fs.readFileSync(process.env.FIREBLOCKS_API_SECRET_PATH, "utf8");
    const fireblocksApiClient = new FireblocksSDK(apiSecret, process.env.FIREBLOCKS_API_KEY);

    const bridge = new EthersBridge({ 
        fireblocksApiClient,
        vaultAccountId: process.env.FIREBLOCKS_SOURCE_VAULT_ACCOUNT || "0",
        externalWalletId: process.env.FIREBLOCKS_EXTERNAL_WALLET,
        chain: CHAIN
    });

    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI);

    const tx = await contract.populateTransaction.distribute({
        gasLimit: 157480
    });

    console.log("Sending greet trasnaction for signing");

    console.log(tx);

    await processTransaction(bridge, tx);
}()).catch(err=> {
    console.log("error", err);
    process.exit(1);
});