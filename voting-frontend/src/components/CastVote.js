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
    <div className="p-4 bg-gray-50 rounded-md shadow-md">
  <h2 className="text-4xl font-semibold text-gray-800 mb-4 text-center">Cast Your Vote Here</h2>

  <ul className="space-y-3">
    <li className="flex items-center justify-between bg-gray-100 p-3 rounded shadow-sm mx-auto w-3/4">
      <span className="text-gray-700 font-medium">BJP</span>
      <button 
        onClick={castVote} 
        className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
      >
        Cast Vote
      </button>
    </li>
    <li className="flex items-center justify-between bg-gray-100 p-3 rounded shadow-sm mx-auto w-3/4">
      <span className="text-gray-700 font-medium">CONGRESS</span>
      <button 
        onClick={castVote} 
        className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
      >
        Cast Vote
      </button>
    </li>
    <li className="flex items-center justify-between bg-gray-100 p-3 rounded shadow-sm mx-auto w-3/4">
      <span className="text-gray-700 font-medium">AAP</span>
      <button 
        onClick={castVote} 
        className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
      >
        Cast Vote
      </button>
    </li>
    <li className="flex items-center justify-between bg-gray-100 p-3 rounded shadow-sm mx-auto w-3/4">
      <span className="text-gray-700 font-medium">NOTA</span>
      <button 
        onClick={castVote} 
        className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
      >
        Cast Vote
      </button>
    </li>
  </ul>

  {message && <p className="mt-4 text-gray-600 text-sm text-center">{message}</p>}
</div>

  );
}

export default CastVote;
