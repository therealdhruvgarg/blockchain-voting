// app.js
// app.js
import { VotingBlockChain, Vote, ec } from './votingSystem.js';
import inquirer from 'inquirer';
import fs from 'fs';


// Create a new voting blockchain instance
const votingSystem = new VotingBlockChain();

async function registerVoter() {
  const { voterName } = await inquirer.prompt({
    name: 'voterName',
    message: 'Enter voter name:'
  });

  const keyPair = ec.genKeyPair();
  const privateKey = keyPair.getPrivate('hex');
  const publicKey = keyPair.getPublic('hex');

  console.log(`Voter ${voterName} registered.`);
  console.log(`Public Key: ${publicKey}`);
  console.log(`Private Key: ${privateKey} (Keep this secure!)`);

  return { privateKey, publicKey, voterName };
}

async function castVote(voter) {
  const { candidate } = await inquirer.prompt({
    name: 'candidate',
    message: 'Enter candidate you want to vote for:'
  });

  const signingKey = ec.keyFromPrivate(voter.privateKey);
  const vote = new Vote(voter.publicKey, candidate);
  vote.signVote(signingKey);

  try {
    votingSystem.addVote(vote);
    console.log(`Vote cast for ${candidate}`);
  } catch (error) {
    console.error(error.message);
  }
}

async function mineVotes() {
  votingSystem.minePendingVotes();
  console.log("Votes have been mined and added to the blockchain.");
}

function viewResults() {
  const results = votingSystem.countVotes();
  console.log("Voting Results:", results);
}

function validateBlockchain() {
  const isValid = votingSystem.isChainValid();
  console.log(`Blockchain integrity is ${isValid ? 'valid' : 'corrupted'}.`);
}

async function main() {
  while (true) {
    const { action } = await inquirer.prompt({
      type: 'list',
      name: 'action',
      message: 'Select an action:',
      choices: [
        'Register as a voter',
        'Cast a vote',
        'Mine votes',
        'View voting results',
        'Validate blockchain',
        'Exit'
      ]
    });

    switch (action) {
      case 'Register as a voter':
        await registerVoter();
        break;
      case 'Cast a vote':
        const voter = await registerVoter();
        await castVote(voter);
        break;
      case 'Mine votes':
        await mineVotes();
        break;
      case 'View voting results':
        viewResults();
        break;
      case 'Validate blockchain':
        validateBlockchain();
        break;
      case 'Exit':
        process.exit();
    }
  }
}

main();
