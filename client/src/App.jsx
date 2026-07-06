import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, User as UserIcon } from 'lucide-react';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CourseDetail from './pages/CourseDetail';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    window.location.href = '/';
  };

  return (
    <Router>
      <div className="app-container">
        <header className="navbar container">
          <Link to="/" className="navbar-brand">
            <BookOpen size={28} />
            <span>STUDENT LMS</span>
          </Link>
          <nav>
            <ul className="nav-links">
              <li><Link to="/">Courses</Link></li>
              {!isAuthenticated ? (
                <>
                  <li><Link to="/login" className="btn btn-outline">Log In</Link></li>
                  <li><Link to="/register" className="btn btn-primary">Sign Up</Link></li>
                </>
              ) : (
                <>
                  <li><Link to="/dashboard" className="nav-icon-link"><UserIcon size={20} /> Dashboard</Link></li>
                  <li>
                    <button onClick={handleLogout} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
                      <LogOut size={16} /> Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </header>

        <main className="container" style={{ padding: '2rem 1.5rem' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login setAuth={setIsAuthenticated} setUser={setUser} />} />
            <Route path="/register" element={<Register setAuth={setIsAuthenticated} setUser={setUser} />} />
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            <Route path="/course/:id" element={<CourseDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
