import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import NavBar from './components/navbar';
import RegisterVoter from './components/RegisterVoter';
import CastVote from './components/CastVote';
import MineVotes from './components/MineVotes';
import ViewResults from './components/ViewResults';
import ValidateBlockchain from './components/ValidateBlockchain';
import Hero from './components/hero'
import Footer from './components/Footer'
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/register" element={<RegisterVoter/>}/>
        <Route path="/login" element={<Login />} />

        {/* Other routes if necessary */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
