import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import NavBar from './components/navbar';
import RegisterVoter from './components/RegisterVoter';
import CastVote from './components/CastVote';
import ViewResults from './components/ViewResults';
import Hero from './components/hero'
import Footer from './components/Footer'
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Process from './components/Process';
import Help from './components/Help';
import ContactUs from './components/ContactUs';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/register" element={<RegisterVoter />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cast-vote" element={<CastVote />} />
        <Route path="/view-results" element={<ViewResults />} />
        <Route path="/process" element={<Process />} />
        <Route path="/help" element={<Help />} />
        <Route path="/contact" element={<ContactUs />} />

      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
