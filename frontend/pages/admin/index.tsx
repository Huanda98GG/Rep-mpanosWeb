import { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken, decodeToken } from '../../lib/auth';
import { useRouter } from 'next/router';

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const t = getToken();
    if (!t) {
      router.push('/login');
      return;
    }
    const payload: any = decodeToken(t) || {};
    if (payload.role !== 'ADMIN') {
      router.push('/login');
      return;
    }
    // Fetch users, leaderboard and rewards
    axios
      .get('http://localhost:3001/users', { headers: { Authorization: `Bearer ${t}` } })
      .then(r => setUsers(r.data))
      .catch(console.error);
    axios
      .get('http://localhost:3001/stats/leaderboard', { headers: { Authorization: `Bearer ${t}` } })
      .then(r => setLeaderboard(r.data))
      .catch(console.error);
    axios
      .get('http://localhost:3001/rewards', { headers: { Authorization: `Bearer ${t}` } })
      .then(r => setRewards(r.data))
      .catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Admin create user form state
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState('SLAVE');
  const [creatingUser, setCreatingUser] = useState(false);

  const createUser = async (e: any) => {
    e.preventDefault();
    const t = getToken();
    if (!t) return;
    setCreatingUser(true);
    try {
      await axios.post('http://localhost:3001/users', { email: newUserEmail, password: newUserPassword, name: newUserName, role: newUserRole }, { headers: { Authorization: `Bearer ${t}` } });
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserName('');
      setNewUserRole('SLAVE');
      const r = await axios.get('http://localhost:3001/users', { headers: { Authorization: `Bearer ${t}` } });
      setUsers(r.data);
    } catch (err) {
      console.error(err);
      alert('Failed to create user: ' + (err?.response?.data?.message || err?.message || 'Unknown error'));
    } finally {
      setCreatingUser(false);
    }
  };

  const deleteUser = async (id: number) => {
    if (!confirm('Delete this user? This action cannot be undone.')) return;
    const t = getToken();
    if (!t) return;
    try {
      await axios.delete(`http://localhost:3001/users/${id}`, { headers: { Authorization: `Bearer ${t}` } });
      const r = await axios.get('http://localhost:3001/users', { headers: { Authorization: `Bearer ${t}` } });
      setUsers(r.data);
    } catch (err) {
      console.error(err);
      alert('Failed to delete user');
    }
  };

  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [rewards, setRewards] = useState<any[]>([]);

  const assignReward = async (rewardId: number, userId: number) => {
    const t = getToken();
    if (!t) return;
    try {
      if (!confirm('Assign this reward to the selected user?')) return;
      await axios.put(`http://localhost:3001/rewards/${rewardId}/assign`, { awardedTo: userId }, { headers: { Authorization: `Bearer ${t}` } });
      // refresh rewards and leaderboard
      const r = await axios.get('http://localhost:3001/rewards', { headers: { Authorization: `Bearer ${t}` } });
      setRewards(r.data);
      const l = await axios.get('http://localhost:3001/stats/leaderboard', { headers: { Authorization: `Bearer ${t}` } });
      setLeaderboard(l.data);
    } catch (e) {
      console.error(e);
    }
  };

  const [newRewardTitle, setNewRewardTitle] = useState('');
  const [creatingReward, setCreatingReward] = useState(false);
  const createReward = async (e: any) => {
    e.preventDefault();
    if (!newRewardTitle.trim()) return;
    const t = getToken();
    if (!t) return;
    setCreatingReward(true);
    try {
      await axios.post('http://localhost:3001/rewards', { title: newRewardTitle }, { headers: { Authorization: `Bearer ${t}` } });
      setNewRewardTitle('');
      const r = await axios.get('http://localhost:3001/rewards', { headers: { Authorization: `Bearer ${t}` } });
      setRewards(r.data);
    } catch (e) {
      console.error(e);
      alert('Failed to create reward: ' + (e?.response?.data?.message || e?.message || 'Unknown error'));
    } finally {
      setCreatingReward(false);
    }
  };

  const [allVictims, setAllVictims] = useState<any[]>([]);
  const loadAllVictims = async () => {
    const t = getToken();
    if (!t) return;
    try {
      const r = await axios.get('http://localhost:3001/victims', { headers: { Authorization: `Bearer ${t}` } });
      setAllVictims(r.data);
    } catch (e) {
      console.error(e);
    }
  };

  const [changingVictim, setChangingVictim] = useState<number | null>(null);
  const updateVictimStatus = async (id: number, status: string) => {
    if (!confirm('Change victim status?')) return;
    const t = getToken();
    if (!t) return;
    setChangingVictim(id);
    try {
      await axios.put(`http://localhost:3001/victims/${id}`, { status }, { headers: { Authorization: `Bearer ${t}` } });
      await loadAllVictims();
    } catch (e) {
      console.error(e);
    } finally {
      setChangingVictim(null);
    }
  };

  const deleteVictim = async (id: number) => {
    if (!confirm('Delete this victim permanently?')) return;
    const t = getToken();
    if (!t) return;
    setChangingVictim(id);
    try {
      await axios.delete(`http://localhost:3001/victims/${id}`, { headers: { Authorization: `Bearer ${t}` } });
      await loadAllVictims();
    } catch (e) {
      console.error(e);
    } finally {
      setChangingVictim(null);
    }
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl mb-4 link-accent">Juan Sao Ville — Admin Dashboard</h1>
      <section className="card mb-4">
        <h2 className="text-xl">Users</h2>
        <form onSubmit={createUser} className="mt-3 mb-4 grid grid-cols-4 gap-2">
          <input className="border p-2 col-span-1" placeholder="Email" value={newUserEmail} onChange={e => setNewUserEmail(e.target.value)} required />
          <input className="border p-2 col-span-1" placeholder="Name" value={newUserName} onChange={e => setNewUserName(e.target.value)} />
          <input className="border p-2 col-span-1" placeholder="Password" type="password" value={newUserPassword} onChange={e => setNewUserPassword(e.target.value)} required />
          <select className="border p-2" value={newUserRole} onChange={e => setNewUserRole(e.target.value)}>
            <option value="SLAVE">SLAVE</option>
            <option value="DEVELOPER">DEVELOPER</option>
          </select>
          <div className="col-span-4">
            <button disabled={creatingUser} className="mt-2 btn-primary">{creatingUser ? 'Creating…' : 'Create user'}</button>
          </div>
        </form>
        <ul className="mt-2 space-y-2">
          {users.map(u => (
            <li key={u.id} className="card flex justify-between items-center">
              <div>
                <div className="font-medium">{u.name || u.email}</div>
                <div className="text-sm text-gray-600">{u.email}</div>
              </div>
              <div className="flex items-center gap-2">
                <select defaultValue={u.role} onChange={async (e) => {
                  const t = getToken();
                  if (!t) return;
                  try {
                    await axios.put(`http://localhost:3001/users/${u.id}`, { role: e.target.value }, { headers: { Authorization: `Bearer ${t}` } });
                    const r = await axios.get('http://localhost:3001/users', { headers: { Authorization: `Bearer ${t}` } });
                    setUsers(r.data);
                  } catch (err) { console.error(err); }
                }} className="border p-1">
                  <option value="ADMIN">ADMIN</option>
                  <option value="SLAVE">SLAVE</option>
                  <option value="DEVELOPER">DEVELOPER</option>
                </select>
                <button onClick={() => deleteUser(u.id)} className="px-2 py-1 btn-primary" style={{background: 'var(--accent-dark)'}}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section className="mt-6 card">
        <h2 className="text-xl">Leaderboard</h2>
        <ol className="mt-2 space-y-2">
          {leaderboard.map((row, idx) => (
            <li key={idx} className="border p-2 rounded">
              <div className="font-medium">{row.user.name || row.user.email}</div>
              <div className="text-sm">Captures: {row.count}</div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-6 card">
        <h2 className="text-xl">Rewards</h2>
        <form onSubmit={createReward} className="mb-3 flex gap-2">
          <input value={newRewardTitle} onChange={e => setNewRewardTitle(e.target.value)} placeholder="Reward title" className="border p-2 flex-1" disabled={creatingReward} />
          <button disabled={creatingReward} className="btn-primary">{creatingReward ? 'Creating…' : 'Create'}</button>
        </form>
        <ul className="mt-2 space-y-2">
          {rewards.map(rw => (
            <li key={rw.id} className="card flex justify-between items-center">
              <div>
                <div className="font-medium">{rw.title}</div>
                <div className="text-sm text-gray-600">Awarded to: {rw.awardedTo ?? '—'}</div>
              </div>
                <div className="space-x-2">
                {users.map(u => (
                  <button key={u.id} onClick={() => assignReward(rw.id, u.id)} disabled={creatingReward} className="px-2 py-1 bg-blue-600 text-white rounded text-sm disabled:opacity-60">Give to {u.id}</button>
                ))}
                <button onClick={async () => {
                  if (!confirm('Delete this reward?')) return;
                  const t = getToken(); if (!t) return;
                  try {
                    await axios.delete(`http://localhost:3001/rewards/${rw.id}`, { headers: { Authorization: `Bearer ${t}` } });
                    const r = await axios.get('http://localhost:3001/rewards', { headers: { Authorization: `Bearer ${t}` } });
                    setRewards(r.data);
                  } catch (err) { console.error(err); alert('Failed to delete reward'); }
                }} className="px-2 py-1 btn-primary" style={{background: 'var(--accent-dark)'}}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 card">
        <h2 className="text-xl">Victim Management</h2>
        <button onClick={loadAllVictims} className="mt-2 mb-2 btn-ghost">Refresh</button>
        <ul className="mt-2 space-y-2">
          {allVictims.map(v => (
            <li key={v.id} className="card flex justify-between items-center">
              <div>
                <div className="font-medium">{v.name}</div>
                <div className="text-sm text-gray-600">Estado: {v.status === 'CAPTURED' ? 'Capturado' : v.status === 'TRANSFORMING' ? 'En transformación' : 'Transformado'}</div>
                {v.skills && <div className="text-sm">Skills: {v.skills}</div>}
              </div>
                <div className="space-x-2">
                <select value={v.status} onChange={async (e) => {
                  const t = getToken();
                  if (!t) return;
                  const newStatus = e.target.value;
                  if (!confirm('Change victim status?')) return;
                  setChangingVictim(v.id);
                  try {
                    await axios.put(`http://localhost:3001/victims/${v.id}`, { status: newStatus }, { headers: { Authorization: `Bearer ${t}` } });
                    await loadAllVictims();
                  } catch (err) {
                    console.error(err);
                  } finally {
                    setChangingVictim(null);
                  }
                }} className="border p-1">
                  <option value="CAPTURED">Capturado</option>
                  <option value="TRANSFORMING">En transformación</option>
                  <option value="TRANSFORMED">Transformado</option>
                </select>
                <button onClick={() => deleteVictim(v.id)} disabled={changingVictim === v.id} className="px-2 py-1 bg-red-600 text-white rounded text-sm disabled:opacity-60">{changingVictim === v.id ? 'Deleting…' : 'Delete'}</button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

// Mark this page as requiring ADMIN role for the global guard in _app
(AdminDashboard as any).requireAuth = true;
(AdminDashboard as any).allowedRoles = ['ADMIN'];
