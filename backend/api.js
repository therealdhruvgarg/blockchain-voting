import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import { VotingBlockChain, Vote, ec } from './votingSystem.js';

const app = express();
const PORT = 4000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

const votingSystem = new VotingBlockChain();


// Assuming a Mongoose schema for users
const User = mongoose.model('User', new mongoose.Schema({
  username: String,
  voterId: String, // Stores the voterId
}));

// Endpoint to get a list of candidates
app.get('/candidates', (req, res) => {
  const candidates = ["BJP", "Congress", "AAP"];
  res.json(candidates);
});


// Endpoint to register a voter
// Endpoint to register a voter
app.post('/register', (req, res) => {
  const voterId = SHA256(Date.now() + Math.random().toString()).toString();
  res.json({ voterId });
});


// Endpoint to cast a vote
app.post('/vote', async (req, res) => {
  const { candidate } = req.body;

  try {
    // Simulate user authentication (replace with actual user identifier logic)
    const loggedInUser = "testUser"; // Replace with authenticated user's identifier

    // Fetch voterId from MongoDB
    const user = await User.findOne({ username: loggedInUser });
    if (!user || !user.voterId) {
      return res.status(404).json({ error: 'Voter not found.' });
    }

    const voterId = user.voterId;

    // Create a new vote instance
    const vote = new Vote(voterId, candidate);

    // Add the vote to the blockchain
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
