// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ReviewsPage from './pages/ReviewsPage';
import WriteReviewPage from './pages/WriteReviewPage';
import AmzonCopy from './pages/amzonCopy';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* <Route path="/" element={<HomePage />} /> */}
          <Route path="/" element={<ReviewsPage />} />
          <Route path="/write-review" element={<WriteReviewPage />} />
          <Route path="/amzcpy" element={<AmzonCopy />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;