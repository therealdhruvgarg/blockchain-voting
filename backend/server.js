import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import twilio from 'twilio';
import SHA256 from 'crypto-js/sha256.js';
import pkg from 'elliptic';
const { ec: EC } = pkg;
const ec = new EC('secp256k1');

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Twilio credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const client = new twilio(accountSid, authToken);

// MongoDB connection
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Error connecting to MongoDB", err));

// Define Voter Schema
const voterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  phoneNumber: { type: String, required: true, unique: false },
  aadharNumber: { type: String, required: true },
  voterId: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
  hasVoted: { type: Boolean, default: false },
});

const Voter = mongoose.model('Voter', voterSchema);


// Temporary in-memory storage for OTPs
const otpStorage = {};

// Blockchain Classes
class Vote {
  constructor(voterId, candidate) {
    this.voterId = voterId;
    this.candidate = candidate;
    this.signature = this.calculateHash();
  }

  calculateHash() {
    return SHA256(this.voterId + this.candidate).toString();
  }

  isValid() {
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
    return this.votes.every(vote => vote.isValid());
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
    return new Block("01/01/2025", [], "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  minePendingVotes() {
    const block = new Block(Date.now(), this.pendingVotes, this.getLatestBlock().hash);
    block.mineBlock(this.difficulty);
    this.chain.push(block);
    this.pendingVotes = [];
  }

  addVote(vote) {
    if (!vote.isValid()) {
      throw new Error('Cannot add invalid vote');
    }
    if (this.voters.has(vote.voterId)) {
      throw new Error('Voter has already cast a vote');
    }
    this.pendingVotes.push(vote);
    this.voters.add(vote.voterId);
  }

  countVotes() {
    const results = {};
    for (const block of this.chain) {
      for (const vote of block.votes) {
        results[vote.candidate] = (results[vote.candidate] || 0) + 1;
      }
    }
    return results;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (!currentBlock.hasValidVotes() || currentBlock.hash !== currentBlock.calculateHash() || currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

// Initialize Express app
const app = express();
app.use(bodyParser.json());
app.use(cors());

const votingSystem = new VotingBlockChain();


// Helper Functions
function generateOtp() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

async function generateUniqueVoterId() {
  let voterId;
  let isUnique = false;

  while (!isUnique) {
    voterId = Math.random().toString(36).substr(2, 8).toUpperCase();
    const existingVoter = await Voter.findOne({ voterId });
    if (!existingVoter) {
      isUnique = true;
    }
  }
  return voterId;
}

// Start Mining Process
function startMiningProcess(interval = 60000) {
  setInterval(() => {
    votingSystem.minePendingVotes();
  }, interval);
}

// Define Candidate Schema
const candidateSchema = new mongoose.Schema({
  candidateId: String,
  partyName: String,
  candidateName: String
});

const Candidate = mongoose.model('Candidate', candidateSchema);

// API route to fetch candidates
app.get('/candidates', async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ error: 'Failed to fetch candidates' });
  }
});


// Routes
// Route to send OTP
app.post('/send-otp', async (req, res) => {
  const { phone } = req.body;

  try {
    const otp = generateOtp();

    // Store the OTP in the memory (it should be replaced with a more secure method for production)
    otpStorage[phone] = otp;

    // Send OTP via Twilio
    await client.messages.create({
      body: `Your OTP is: ${otp}`,
      from: twilioPhoneNumber,
      to: phone
    });

    // Respond with a success message
    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
});


// Route to verify OTP
app.post("/verify-otp", (req, res) => {
  const { phone, otp } = req.body;

  // Check if the OTP matches the one stored in otpStorage
  if (otpStorage[phone] && otpStorage[phone] === otp) {
    // OTP is correct, delete it from storage
    delete otpStorage[phone];
    res.json({ success: true, message: "OTP verified successfully." });
  } else {
    res.json({ success: false, message: "Invalid OTP." });
  }
});


app.post('/register', async (req, res) => {
  const { name, dob, phoneNumber, aadharNumber } = req.body; // Ensure 'phoneNumber' matches the frontend field

  try {
    const voterId = await generateUniqueVoterId();

    const newVoter = new Voter({
      name,
      dob,
      phoneNumber,
      aadharNumber,
      voterId
    });

    console.log("Registering new voter:", newVoter);

    await newVoter.save();

    await client.messages.create({
      body: `Your Voter ID is: ${voterId}`,
      from: twilioPhoneNumber,
      to: phoneNumber,
    });

    res.json({ voterId });
  } catch (error) {
    console.log("Error during voter registration:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/login", async (req, res) => {
  const { voterId, dob } = req.body;

  try {
    const voter = await Voter.findOne({ voterId });

    if (!voter) {
      return res.status(400).json({ success: false, message: "Voter not found." });
    }

    // Check if the DOB matches
    if (new Date(voter.dob).toISOString().split("T")[0] !== new Date(dob).toISOString().split("T")[0]) {
      return res.status(400).json({ success: false, message: "Invalid Date of Birth." });
    }

    res.json({ success: true, message: "Login successful." });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});





app.post('/vote', async (req, res) => {
  const { voterId, candidate } = req.body;

  try {
    // Check if the voter already voted
    const voter = await Voter.findOne({ voterId });
    if (!voter) {
      return res.status(404).json({ error: 'Voter not found' });
    }

    if (voter.hasVoted) {
      return res.status(400).json({ error: 'Voter has already cast their vote' });
    }

    // Cast the vote by creating a new Vote object
    const vote = new Vote(voterId, candidate);
    votingSystem.addVote(vote);

    // Mark the voter as having voted
    voter.hasVoted = true;
    await voter.save();

    res.json({ message: 'Vote cast successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


app.post('/mine', (req, res) => {
  votingSystem.minePendingVotes();
  res.json({ message: 'Votes mined successfully' });
});

app.get('/results', (req, res) => {
  res.json(votingSystem.countVotes());
});

app.get('/validate', (req, res) => {
  res.json({ isValid: votingSystem.isChainValid() });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  startMiningProcess(); // Start mining in the background
});