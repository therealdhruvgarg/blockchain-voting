import React, { useState } from 'react';
import axios from 'axios';

function ValidateBlockchain() {
  const [isValid, setIsValid] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const validateBlockchain = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/validate`);
      setIsValid(response.data.isValid);
    } catch (err) {
      setError('Failed to validate blockchain. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-xl rounded-lg mt-8">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Validate Blockchain</h2>

      <div className="flex justify-center mb-4">
        <button
          onClick={validateBlockchain}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          {loading ? 'Validating...' : 'Validate Blockchain'}
        </button>
      </div>

      {loading && <div className="text-center text-blue-500">Validating...</div>}

      {error && <div className="text-center text-red-500">{error}</div>}

      {isValid !== null && !loading && (
        <div className="text-center mt-4">
          <p className={`text-lg font-semibold ${isValid ? 'text-green-500' : 'text-red-500'}`}>
            Blockchain integrity is {isValid ? 'valid' : 'corrupted'}
          </p>
        </div>
      )}
    </div>
  );
}

export default ValidateBlockchain;
