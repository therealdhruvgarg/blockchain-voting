// Load environment variables from .env file
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const twilio = require('twilio');

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
  name: String,
  dob: Date,
  phoneNumber: String,
  aadharNumber: String,
  voterId: { type: String, unique: true }, // Unique voter ID
  createdAt: { type: Date, default: Date.now }
});
const Voter = mongoose.model('Voter', voterSchema);
// Function to generate a unique voter ID
function generateUniqueVoterId() {
  return `VOTER-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}
// Initialize Express app
const app = express();
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all origins

const otpStore = {}; // Temporarily store OTPs for each phone number

// Generate OTP
function generateOtp() {
  return Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
}

// Generate Unique Voter ID
async function generateUniqueVoterId() {
  let voterId;
  let isUnique = false;

  while (!isUnique) {
    // Generate a random 8-character alphanumeric voter ID
    voterId = Math.random().toString(36).substr(2, 8).toUpperCase();
    
    // Check if the voter ID already exists in the database
    const existingVoter = await Voter.findOne({ voterId });
    if (!existingVoter) {
      isUnique = true; // Voter ID is unique
    }
  }
  return voterId;
}

// Route to send OTP
app.post('/send-otp', (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  const otp = generateOtp();
  otpStore[phone] = otp;

  client.messages
    .create({
      body: `Your OTP is ${otp}`,
      from: twilioPhoneNumber,
      to: phone,
    })
    .then((message) => {
      console.log(`OTP sent: ${message.sid}`);
      res.json({ success: true, message: 'OTP sent successfully' });
    })
    .catch((error) => {
      console.error("Error while sending OTP:", error);  // Log the error for debugging
      res.status(500).json({ success: false, error: `Failed to send OTP: ${error.message}` });
    });
});

// Route to get mobile number by Aadhaar
app.post('/get-mobile-by-aadhaar', async (req, res) => {
  const { aadharNumber } = req.body;

  if (!aadharNumber) {
    return res.status(400).json({ error: 'Aadhaar number is required' });
  }

  try {
    // Find the voter by Aadhaar number
    const voter = await Voter.findOne({ aadharNumber });

    if (voter) {
      res.json({ success: true, mobile: voter.phoneNumber });
    } else {
      res.status(404).json({ success: false, message: 'Voter not found' });
    }
  } catch (error) {
    console.error('Error fetching mobile number by Aadhaar:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Route to verify OTP
app.post('/verify-otp', (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ error: 'Phone number and OTP are required' });
  }

  if (otpStore[phone] === otp) {
    delete otpStore[phone]; // Clear OTP after successful verification
    res.json({ success: true, message: 'OTP verified successfully' });
  } else {
    res.status(400).json({ success: false, error: 'Invalid OTP' });
  }
});

// Route to register voter
app.post('/register', async (req, res) => {
  const { name, dob, phoneNumber, aadharNumber } = req.body;

  if (!name || !dob || !phoneNumber || !aadharNumber) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Generate unique voter ID
    const voterId = generateUniqueVoterId();

    // Create and save the voter in the database
    const newVoter = new Voter({
      name,
      dob,
      phoneNumber,
      aadharNumber,
      voterId, // Save the voter ID
    });

    await newVoter.save();

    // Send voter ID via Twilio
    await client.messages.create({
      body: `Hello ${name}! Your voter registration is successful. Your Voter ID is: ${voterId}. Please keep this ID safe.`,
      from: twilioPhoneNumber,
      to: phoneNumber,
    });

    console.log(`Voter ID ${voterId} sent to ${phoneNumber}`); // Debug log
    res.status(201).json({ message: 'Voter registered successfully', voterId });
  } catch (error) {
    console.error('Error registering voter:', error);
    res.status(500).json({ message: 'Error registering voter, please try again later.' });
  }
});


// Start the server on port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
