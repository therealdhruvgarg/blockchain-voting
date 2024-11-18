// votingSystem.js
import SHA256 from 'crypto-js/sha256.js';
import pkg from 'elliptic';
const { ec: EC } = pkg;
const ec = new EC('secp256k1');

class Vote {
  constructor(voterId, candidate) {
    this.voterId = voterId;
    this.candidate = candidate;
    this.signature = this.calculateHash(); // Use the hash of voterId and candidate as the "signature"
  }

  calculateHash() {
    return SHA256(this.voterId + this.candidate).toString();
  }

  isValid() {
    // Check if the signature matches the calculated hash
    return this.signature === this.calculateHash();
  }
}


class Block {
  constructor(timestamp, votes, previousHash = "") {
    this.timestamp = timestamp;
    this.votes = votes;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }
  calculateHash() {
    return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.votes) + this.nonce).toString();
  }
  mineBlock(difficulty) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log("Block mined: " + this.hash);
  }
  hasValidVotes() {
    for(const vote of this.votes){
      if(!vote.isValid()){
        return false;
      }
    }
    return true;    
  }
}

class VotingBlockChain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
    this.pendingVotes = [];
    this.voters = new Set();
  }

  createGenesisBlock() {
    return new Block("01/01/2024", [], "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingVotes() {
    const block = new Block(Date.now(), this.pendingVotes, this.getLatestBlock().hash);
    block.mineBlock(this.difficulty);
    console.log("Block successfully mined!");
    this.chain.push(block);
    this.pendingVotes = [];
  }

  addVote(vote) {
    if (!vote.voterId || !vote.candidate) {
      throw new Error('Vote must include voterId and candidate');
    }
    if (!vote.isValid()) {
      throw new Error('Cannot add invalid vote');
    }
    if (this.voters.has(vote.voterId)) {
      throw new Error('Voter has already cast a vote');
    }
    this.pendingVotes.push(vote);
    this.voters.add(vote.voterId); // Prevents double voting
  }
  

  countVotes() {
    const voteCounts = {};
    for (const block of this.chain) {
      for (const vote of block.votes) {
        if(voteCounts[vote.candidate]) {
          voteCounts[vote.candidate]++;
        } else {
          voteCounts[vote.candidate] = 1;
        }
      }
    }
    return voteCounts;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];
      if (!currentBlock.hasValidVotes()) {
        return false;
      }
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

export { VotingBlockChain, Vote, ec };
