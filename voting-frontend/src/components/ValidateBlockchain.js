// src/components/ValidateBlockchain.js
import React, { useState } from 'react';
import axios from 'axios';

function ValidateBlockchain() {
  const [isValid, setIsValid] = useState(null);

  const validateBlockchain = async () => {
    const response = await axios.get('http://localhost:4000/validate');
    setIsValid(response.data.isValid);
  };

  return (
    <div>
      <h2>Validate Blockchain</h2>
      <button onClick={validateBlockchain}>Validate</button>
      {isValid !== null && (
        <p>Blockchain integrity is {isValid ? 'valid' : 'corrupted'}</p>
      )}
    </div>
  );
}

export default ValidateBlockchain;
