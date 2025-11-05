import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('jsv_token');
  let userRole = null;

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userRole = payload.role;
    } catch (e) {
      console.error('Invalid token', e);
      localStorage.removeItem('jsv_token');
      navigate('/login');
    }
  }

  const handleLogout = async () => {
    try {
      if (token) await fetch(`${process.env.REACT_APP_API_URL}/auth/logout`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('jsv_token');
    // prevent back navigation to protected pages by pushing login state and listening for pop
    try { window.history.pushState({}, '', '/login'); } catch (e) { /* ignore */ }
    window.addEventListener('popstate', () => { localStorage.removeItem('jsv_token'); navigate('/login'); }, { once: true });
    navigate('/login');
  };

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        {token ? (
          <>
            {userRole === 'ADMIN' && (
              <>
                <li>
                  <Link to="/admin/users">Admin Users</Link>
                </li>
                <li>
                  <Link to="/admin/victims">Admin Victims</Link>
                </li>
                <li>
                  <Link to="/admin/feedback">Admin Feedback</Link>
                </li>
                <li>
                  <Link to="/admin/rewards">Admin Rewards</Link>
                </li>
              </>
            )}
            {userRole === 'SLAVE' && (
              <li>
                <Link to="/victims">My Victims</Link>
              </li>
            )}
            <li>
              <Link to="/feedback">Feedback</Link>
            </li>
            <li>
              <Link to="/rewards">Rewards</Link>
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
