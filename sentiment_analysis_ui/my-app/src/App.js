import './css/index.css';
import { Login } from './Pages/Login/Login';
import { Routes, Route } from 'react-router-dom';
import { Dashboard } from './Pages/Dashboard';
import { Navbar } from './Pages/navbar';


function App() {
  return (
    <div>
      <Navbar />
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
