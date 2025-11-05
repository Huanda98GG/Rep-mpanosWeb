import React, { useEffect, useState } from 'react';

export default function AdminRewards() {
  const [rewards, setRewards] = useState([]);
  const [users, setUsers] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const API = process.env.REACT_APP_API_URL || 'http://localhost:3001';
  const token = localStorage.getItem('jsv_token');

  useEffect(() => {
    if (!token) return;
    fetch(`${API}/users`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(setUsers)
      .catch(console.error);
    loadRewards();
    // eslint-disable-next-line
  }, []);

  const loadRewards = () => {
    if (!token) return;
    fetch(`${API}/rewards`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(setRewards)
      .catch(console.error);
  };

  const createReward = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setLoading(true);
    try {
      await fetch(`${API}/rewards`, { method: 'POST', headers: { 'content-type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ title: newTitle }) });
      setNewTitle('');
      await loadRewards();
    } catch (e) {
      console.error(e);
      alert('Failed to create reward');
    } finally { setLoading(false); }
  };

  const assignReward = async (rewardId, userId) => {
    if (!window.confirm('Assign this reward?')) return;
    try {
      await fetch(`${API}/rewards/${rewardId}/assign`, { method: 'PUT', headers: { 'content-type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ awardedTo: userId }) });
      await loadRewards();
    } catch (e) { console.error(e); alert('Failed to assign'); }
  };

  const deleteReward = async (id) => {
    if (!window.confirm('Delete this reward?')) return;
    try {
      await fetch(`${API}/rewards/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      await loadRewards();
    } catch (e) { console.error(e); alert('Failed to delete'); }
  };

  return (
    <div>
      <h2>Admin — Rewards</h2>
      <form onSubmit={createReward} style={{ marginBottom: 12 }}>
        <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Reward title" />
        <button disabled={loading} type="submit">{loading ? 'Creating…' : 'Create'}</button>
      </form>

      <h3>Available rewards</h3>
      <ul>
        {rewards.map(r => (
          <li key={r.id} style={{ marginBottom: 8 }}>
            <strong>{r.title}</strong> — Awarded to: {r.awardedTo ?? '—'}
            <div style={{ marginTop: 6 }}>
              {users.map(u => (
                <button key={u.id} onClick={() => assignReward(r.id, u.id)} style={{ marginRight: 6 }}>Give to {u.name || u.email}</button>
              ))}
              <button onClick={() => deleteReward(r.id)} style={{ marginLeft: 8 }}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
