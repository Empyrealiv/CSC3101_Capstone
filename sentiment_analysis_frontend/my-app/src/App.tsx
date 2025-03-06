import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard/index.tsx';
import { Home } from './pages/Home/index.tsx';
import { Test } from './pages/Test/index.tsx';
import { Documentation } from './pages/Documentation/index.tsx';
import "./assets/index.css";

function App() {
  return (
    <main className='main'>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/test" element={<Test />} />
        <Route path="/documentation" element={<Documentation />} />
      </Routes>
    </main>
  )
}

export default App