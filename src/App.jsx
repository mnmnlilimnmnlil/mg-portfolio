import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.scss';
import CommonNav from './CommonNav';
import HomePage from './HomePage';

function App() {
  return (
    <div className="app">
      <CommonNav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </div>
  );
}

export default App;