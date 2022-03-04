import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Catalog from './Catalog';
import Detail from './Detail';

const App = () => (
  <main>
    <Routes>
      <Route path="/" element={<Catalog />} />
      <Route path="/:id" element={<Detail />} />
    </Routes>
  </main>
);

export default App;
