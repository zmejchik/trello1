import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { Board } from './pages/Board/Board';
import { Home } from './pages/Home/Home';
import ModalCardWindow from './pages/Board/components/ModalCardWindow/ModalCardWindow';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';

function App(): JSX.Element {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/board/:boardId/" element={<Board />}>
        <Route path="card/:cardId" element={<ModalCardWindow />} />
      </Route>
      <Route path="/login/" element={<Login />} />
      <Route path="/register/" element={<Register />} />
    </Routes>
  );
}

export default App;
