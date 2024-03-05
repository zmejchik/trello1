import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { Board } from './pages/Home/components/Board/Board';
import { Home } from './pages/Home/Home';

function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/trello" element={<Home />} />
      <Route path="/trello/board" element={<Board />} />
    </Routes>
  );
}

export default App;
