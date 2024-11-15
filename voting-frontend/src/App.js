// src/App.js
import React from 'react';
import RegisterVoter from './components/RegisterVoter';
import CastVote from './components/CastVote';
import MineVotes from './components/MineVotes';
import ViewResults from './components/ViewResults';
import ValidateBlockchain from './components/ValidateBlockchain';

function App() {
  return (
    <div>
      <h1>Blockchain Voting System</h1>
      <RegisterVoter />
      <CastVote />
      <MineVotes />
      <ViewResults />
      <ValidateBlockchain />
    </div>
  );
}

export default App;
