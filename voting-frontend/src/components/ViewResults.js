// src/components/ViewResults.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ViewResults() {
  const [results, setResults] = useState({});

  useEffect(() => {
    const fetchResults = async () => {
      const response = await axios.get('http://localhost:4000/results');
      setResults(response.data);
    };
    fetchResults();
  }, []);

  return (
    <div>
      <h2>Voting Results</h2>
      <ul>
        {Object.keys(results).map((candidate) => (
          <li key={candidate}>
            {candidate}: {results[candidate]} votes
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ViewResults;
