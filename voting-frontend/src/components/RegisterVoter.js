// src/components/RegisterVoter.js
import React, { useState } from 'react';
import axios from 'axios';

function RegisterVoter() {
  const [keys, setKeys] = useState(null);

  const registerVoter = async () => {
    const response = await axios.post('http://localhost:4000/register');
    setKeys(response.data);
  };

  return (
    <div>
      <h2>Register Voter</h2>
      <button onClick={registerVoter}>Register</button>
      {keys && (
        <div>
          <p>Public Key: {keys.publicKey}</p>
          <p>Private Key: {keys.privateKey} (Keep this secure!)</p>
        </div>
      )}
    </div>
  );
}

export default RegisterVoter;
