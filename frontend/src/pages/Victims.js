// Victims.js
import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';

function Victims() {
  const [victims, setVictims] = useState([]);
  const [error, setError] = useState(null);

  // ✅ Base URL del backend desde .env
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchVictims = async () => {
      try {
  const token = localStorage.getItem('jsv_token');

        if (!token) {
          setError('No authentication token found. Please log in again.');
          return;
        }

        const response = await fetch(`${API_URL}/victims/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || 'Failed to fetch victims');
        }

        const data = await response.json();
        setVictims(data);
      } catch (error) {
        console.error('Error fetching victims:', error);
        setError(error.message);
      }
    };

    fetchVictims();
  }, [API_URL]);

  const [form, setForm] = useState({ name: '', skills: '', transformationTarget: 'DEVELOPER', lastSeen: '' });
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('jsv_token');
      if (!token) return setError('Please login as a Slave to register victims');
      const res = await fetch(`${API_URL}/victims`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: form.name, skills: form.skills, transformationTarget: form.transformationTarget, lastSeen: form.lastSeen }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Failed to create victim');
      }
      const created = await res.json();
      setVictims(v => [created, ...v]);
      setForm({ name: '', skills: '' });
      setForm({ name: '', skills: '', transformationTarget: 'DEVELOPER', lastSeen: '' });
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error creating victim');
    }
  };

  return (
    <div>
      <h2>My Victims</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleCreate} style={{ marginBottom: 12 }}>
        <h3>Register a new victim</h3>
        <input placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
        <input placeholder="Skills" value={form.skills} onChange={e => setForm(f => ({ ...f, skills: e.target.value }))} />
        <label style={{ display: 'block', marginTop: 8 }}>
          Transformation target:
          <select value={form.transformationTarget} onChange={e => setForm(f => ({ ...f, transformationTarget: e.target.value }))}>
            <option value="DEVELOPER">Developer</option>
            <option value="DATA_SCIENTIST">Data Scientist</option>
          </select>
        </label>
        <label style={{ display: 'block', marginTop: 8 }}>
          Last seen:
          <input type="datetime-local" value={form.lastSeen} onChange={e => setForm(f => ({ ...f, lastSeen: e.target.value }))} />
        </label>
        <button type="submit">Register</button>
      </form>
      {victims.length === 0 ? (
        <p>No victims found.</p>
      ) : (
        <ul>
          {victims.map((victim) => (
            <li key={victim.id}>
              <div><strong dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(victim.name) }} /></div>
              {victim.skills && <div>Skills: {victim.skills}</div>}
              <div>Status: {victim.status}</div>
              {victim.transformationTarget && <div>Target: {victim.transformationTarget === 'DEVELOPER' ? 'Developer' : victim.transformationTarget === 'DATA_SCIENTIST' ? 'Data Scientist' : victim.transformationTarget}</div>}
              {victim.lastSeen && <div>Last seen: {new Date(victim.lastSeen).toLocaleString()}</div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Victims;
