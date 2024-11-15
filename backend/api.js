import express from 'express';
import cors from 'cors';
import { VotingBlockChain, Vote, ec } from './votingSystem.js';

const app = express();
const PORT = 4000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

const votingSystem = new VotingBlockChain();

// Endpoint to register a voter
app.post('/register', (req, res) => {
  const keyPair = ec.genKeyPair();
  const publicKey = keyPair.getPublic('hex');
  const privateKey = keyPair.getPrivate('hex');
  res.json({ publicKey, privateKey });
});

// Endpoint to cast a vote
app.post('/vote', (req, res) => {
  const { publicKey, privateKey, candidate } = req.body;
  const signingKey = ec.keyFromPrivate(privateKey);
  const vote = new Vote(publicKey, candidate);
  vote.signVote(signingKey);

  try {
    votingSystem.addVote(vote);
    res.json({ message: 'Vote cast successfully.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Endpoint to mine votes
app.post('/mine', (req, res) => {
  votingSystem.minePendingVotes();
  res.json({ message: 'Votes mined successfully.' });
});

// Endpoint to get vote results
app.get('/results', (req, res) => {
  const results = votingSystem.countVotes();
  res.json(results);
});

// Endpoint to validate blockchain
app.get('/validate', (req, res) => {
  const isValid = votingSystem.isChainValid();
  res.json({ isValid });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
