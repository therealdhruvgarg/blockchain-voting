import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ViewResults() {
  const [results, setResults] = useState({});
  const [candidates, setCandidates] = useState([]); // Store the full list of candidates
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Fetch results
        const resultsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/results`);
        setResults(resultsResponse.data);

        // Fetch candidates
        const candidatesResponse = await axios.get(`${process.env.REACT_APP_API_URL}/candidates`);
        setCandidates(candidatesResponse.data);
      } catch (error) {
        setError('Failed to load results. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-lg mt-8">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Voting Results</h2>

      {loading ? (
        <div className="text-center text-blue-500">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div>
          {candidates.length === 0 ? (
            <p className="text-center text-gray-500">No votes yet.</p>
          ) : (
            <ul className="space-y-4">
              {candidates.map((candidate) => (
                <li
                  key={candidate.candidateId}
                  className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow-sm"
                >
                  <span className="font-medium text-gray-800">
                    {candidate.candidateName} ({candidate.partyName})
                  </span>
                  <span className="text-gray-600">
                    {results[candidate.candidateId] || 0} votes
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default ViewResults;
