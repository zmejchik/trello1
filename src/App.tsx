import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { Board } from './pages/Board/components/Board/Board';
import { Home } from './Home';

function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/trello" element={<Home />} />
      <Route path="/trello/board" element={<Board />} />
    </Routes>
  );
}

export default App;
