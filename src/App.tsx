import React from 'react';
import { Routes, Route } from 'react-router-dom';

import './App.css';

import Catalog from './Catalog';
import Pokemon from './Pokemon';

const App = () => (
  <div className="App">
    <Routes>
      <Route path="/" element={<Catalog />} />
      <Route path="/:id" element={<Pokemon />} />
    </Routes>
  </div>
);

export default App;
