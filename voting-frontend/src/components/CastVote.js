// src/components/CastVote.js
import React, { useState } from 'react';
import axios from 'axios';

function CastVote() {
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [candidate, setCandidate] = useState('');
  const [message, setMessage] = useState('');

  const castVote = async () => {
    try {
      const response = await axios.post('http://localhost:4000/vote', {
        publicKey,
        privateKey,
        candidate,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  return (
    <div>
      <h2>Cast Vote</h2>
      <input
        type="text"
        placeholder="Public Key"
        value={publicKey}
        onChange={(e) => setPublicKey(e.target.value)}
      />
      <input
        type="text"
        placeholder="Private Key"
        value={privateKey}
        onChange={(e) => setPrivateKey(e.target.value)}
      />
      <input
        type="text"
        placeholder="Candidate"
        value={candidate}
        onChange={(e) => setCandidate(e.target.value)}
      />
      <button onClick={castVote}>Cast Vote</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default CastVote;
