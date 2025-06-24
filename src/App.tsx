import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import CreatePoll from './components/CreatePoll';
import PollView from './components/PollView';
import PollResults from './components/PollResults';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePoll />} />
        <Route path="/poll/:id" element={<PollView />} />
        <Route path="/results/:id" element={<PollResults />} />
      </Routes>
    </Router>
  );
}

export default App;