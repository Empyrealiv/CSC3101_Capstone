import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard/index.tsx';

function App() {
  return (
    <main>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </main>
  )
}

export default App