const EC = require('elliptic').ec;  
const ec = new EC('secp256k1');
const {BlockChain,Transactions} = require("./blockchain");

const myKey = ec.keyFromPrivate('f82724a834736b374dc68c4e0e7f4ad2184805c8727e0de9006ef7c141ab1112');
const myWalletAddress = myKey.getPublic('hex');


let dhruvCoin = new BlockChain();

const tx1 = new Transactions(myWalletAddress, 'public key goes here', 10);
tx1.signTransaction(myKey);
dhruvCoin.addTransaction(tx1);
console.log("\n Starting the miner...");
dhruvCoin.minedPendingTransactions(myWalletAddress);

console.log(
  "\n Balance of garg is",
  dhruvCoin.getBalanceOfAddress(myWalletAddress)
);


