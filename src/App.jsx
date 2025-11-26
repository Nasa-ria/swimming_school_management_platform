import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Sessions from './pages/Sessions';
import Bookings from './pages/Bookings';
import Shop from './pages/Shop';
import Blog from './pages/Blog';
import Profile from './pages/Profile';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import AdminInstructors from './pages/AdminInstructors';
import AdminStudents from './pages/AdminStudents';
import AdminBlog from './pages/AdminBlog';
import AdminProducts from './pages/AdminProducts';
import './App.css';

import { useState } from 'react';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-container">
            <Link to="/" className="nav-logo">
              🏊‍♂️ Swimming School
            </Link>
            <ul className="nav-menu">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/blog">Blog</Link></li>

              {isLoggedIn && userRole === 'student' && (
                <>
                  <li><Link to="/student">Dashboard</Link></li>
                  <li><Link to="/bookings">My Bookings</Link></li>
                  <li><Link to="/profile">Profile</Link></li>
                  <li><Link to="/sessions">Sessions</Link></li>
                  <li><Link to="/blog">Blog</Link></li>

                </>
              )}
              {isLoggedIn && userRole === 'admin' && (
                <>
                  <li><Link to="/admin">Dashboard</Link></li>
                  <li><Link to="/admin/members">Members</Link></li>
                  <li><Link to="/admin/sessions">Sessions</Link></li>
                </>
              )}
              <li><Link to="/shop">Shop</Link></li>
              {!isLoggedIn && <li><Link to="/login">Login</Link></li>}
            </ul>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sessions" element={<Sessions />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path="/admin" element={isLoggedIn && userRole === 'admin' ? <AdminDashboard /> : <Login setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />} />
            <Route path="/admin/instructors" element={isLoggedIn && userRole === 'admin' ? <AdminInstructors /> : <Login setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />} />
            <Route path="/admin/members" element={isLoggedIn && userRole === 'admin' ? <AdminStudents /> : <Login setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />} />
            <Route path="/admin/blog" element={isLoggedIn && userRole === 'admin' ? <AdminBlog /> : <Login setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />} />
            <Route path="/admin/products" element={isLoggedIn && userRole === 'admin' ? <AdminProducts /> : <Login setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />} />
            <Route path="/student" element={isLoggedIn && userRole === 'student' ? <StudentDashboard /> : <Login setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />} />
          </Routes>
        </main>

        <footer className="footer">
          <div className="footer-container">
            <div className="footer-section">
              <h3>Swimming School</h3>
              <p>Your comprehensive platform for swimming education</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/sessions">Browse Sessions</Link></li>
                <li><Link to="/shop">Shop Equipment</Link></li>
                <li><Link to="/blog">Read Blog</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <p>Email: info@swimmingschool.com</p>
              <p>Phone: +1 (555) 123-4567</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 Swimming School Management Platform. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;

