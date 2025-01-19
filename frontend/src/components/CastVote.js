// CastVote Component
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function CastVote() {
  const [candidate, setCandidate] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [message, setMessage] = useState('');
  const location = useLocation(); // Access location state

  // Access voterId passed from Login
  const voterId = location.state?.voterId;

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/candidates`);
        setCandidates(response.data); // Assuming the data is an array of candidates
      } catch (error) {
        setMessage('Failed to load candidates');
      }
    };

    fetchCandidates();
  }, []);

  const castVote = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/vote`, {
        voterId, // Pass voterId along with candidate
        candidate, // Only send the candidate; backend fetches voterId
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.error || 'An error occurred.');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
      <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">Cast Your Vote</h1>

      <div className="mb-4">
        <label htmlFor="candidate" className="block text-gray-700 text-sm font-medium mb-2">Select Candidate:</label>
        <select
          id="candidate"
          value={candidate}
          onChange={(e) => setCandidate(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>Choose a candidate</option>
          {candidates.map((cand) => (
            <option key={cand.candidateId} value={cand.candidateId}>
              {cand.candidateName} ({cand.partyName})
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={castVote}
        className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Cast Vote
      </button>

      {message && <p className="text-center mt-4 text-sm text-gray-600">{message}</p>}
    </div>
  );
}

export default CastVote;
