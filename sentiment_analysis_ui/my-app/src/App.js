import logo from './logo.svg';
import './css/index.css';
import { Login } from './Pages/Login/Login';
import { Routes, Route, Link } from 'react-router-dom';
import { Dashboard } from './Pages/Dashboard';


function App() {
  return (
    <div>
      <nav>
        <ul>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
        </ul>
      </nav>
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
