import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminUsers from './pages/AdminUsers';
import AdminVictims from './pages/AdminVictims';
import AdminFeedback from './pages/AdminFeedback';
import Victims from './pages/Victims';
import Feedback from './pages/Feedback';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Navbar />
        </header>
        <main className="App-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/victims" element={<AdminVictims />} />
            <Route path="/admin/feedback" element={<AdminFeedback />} />
            <Route path="/victims" element={<Victims />} />
            <Route path="/feedback" element={<Feedback />} />
          </Routes>
        </main>
        <footer className="App-footer">
          <p>Mpanos Web © 2023</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
