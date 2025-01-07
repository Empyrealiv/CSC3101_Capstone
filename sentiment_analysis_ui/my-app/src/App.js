import './css/index.css';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './Pages/navbar';
import Home from './Pages/Home/Home';
import Login from './Pages/Login/Login';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <div className="app-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
