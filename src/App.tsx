import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { Board } from './pages/Board/Board';
import { Home } from './pages/Home/Home';
import ModalCardWindow from './pages/Board/components/ModalCardWindow/ModalCardWindow';

function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/board/:boardId/*" element={<Board />}>
        <Route path="card/:cardId" element={<ModalCardWindow />} />
      </Route>
    </Routes>
  );
}

export default App;
