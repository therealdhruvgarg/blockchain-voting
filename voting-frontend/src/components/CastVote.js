import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CastVote() {
  const [candidate, setCandidate] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [message, setMessage] = useState('');

  // Fetch candidates from the backend
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get('http://localhost:4000/candidates');
        setCandidates(response.data);
      } catch (error) {
        setMessage('Failed to load candidates.');
      }
    };

    fetchCandidates();
  }, []);

  // Handle vote submission
  const castVote = async () => {
    try {
      const response = await axios.post('http://localhost:4000/vote', {
        candidate, // Only send the candidate; backend fetches voterId
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred.');
    }
  };

  return (
    <div>
      <h1>Cast Your Vote</h1>
      <div>
        <label>Select Candidate:</label>
        <select
          value={candidate}
          onChange={(e) => setCandidate(e.target.value)}
        >
          <option value="" disabled>
            Choose a candidate
          </option>
          {candidates.map((cand, index) => (
            <option key={index} value={cand}>
              {cand}
            </option>
          ))}
        </select>
      </div>
      <button onClick={castVote}>Cast Vote</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default CastVote;
