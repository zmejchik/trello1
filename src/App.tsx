import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { Board } from './pages/Board/Board';
import { Home } from './pages/Home/Home';

function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/board/:boardId/*" element={<Board />} />
    </Routes>
  );
}

export default App;
