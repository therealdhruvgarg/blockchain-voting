// src/components/MineVotes.js
import React, { useState } from 'react';
import axios from 'axios';

function MineVotes() {
  const [message, setMessage] = useState('');

  const mineVotes = async () => {
    const response = await axios.post('http://localhost:4000/mine');
    setMessage(response.data.message);
  };

  return (
    <div>
      <h2>Mine Votes</h2>
      <button onClick={mineVotes}>Mine</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default MineVotes;
