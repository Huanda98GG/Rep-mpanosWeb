import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { getToken, decodeToken } from '../../lib/auth';
import { useRouter } from 'next/router';

export default function SlaveDashboard() {
  const [victims, setVictims] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [skills, setSkills] = useState('');
  const [lastSeen, setLastSeen] = useState('');
  const [transformationTarget, setTransformationTarget] = useState('DEVELOPER');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [creating, setCreating] = useState(false);

  const load = async () => {
    const t = getToken();
    if (!t) {
      router.push('/login');
      return;
    }
    try {
      const r = await axios.get('http://localhost:3001/victims/me', { headers: { Authorization: `Bearer ${t}` } });
      setVictims(r.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const token = getToken();
    const payload: any = token ? decodeToken(token) || {} : {};
    if (token && payload.role !== 'SLAVE') {
      // If logged in but not a slave, redirect to admin or login
      if (payload.role === 'ADMIN') router.push('/admin');
      else router.push('/login');
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCreate = async (e: any) => {
    e.preventDefault();
    setError(null);
    const t = getToken();
    if (!t) {
      setError('Not authenticated');
      router.push('/login');
      return;
    }
    setCreating(true);
    try {
  await axios.post('http://localhost:3001/victims', { name, skills, lastSeen, transformationTarget }, { headers: { Authorization: `Bearer ${t}` } });
      setName('');
      setSkills('');
      await load();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create victim');
    }
    setCreating(false);
  };

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl mb-4">Slave Dashboard</h1>

      <section className="mb-6">
        <h2 className="text-xl mb-2">Capture a Victim</h2>
        <form onSubmit={onCreate} className="space-y-3">
          <div>
            <label className="block text-sm">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border p-2" required />
          </div>
          <div>
            <label className="block text-sm">Skills (comma separated)</label>
            <input value={skills} onChange={(e) => setSkills(e.target.value)} className="w-full border p-2" />
          </div>
          <div>
            <label className="block text-sm">Last seen (optional)</label>
            <input type="datetime-local" value={lastSeen} onChange={(e) => setLastSeen(e.target.value)} className="w-full border p-2" />
          </div>
          <div>
            <label className="block text-sm">Transformation target</label>
            <select value={transformationTarget} onChange={(e) => setTransformationTarget(e.target.value)} className="w-full border p-2">
              <option value="DEVELOPER">Developer</option>
              <option value="DATA_SCIENTIST">Data Scientist</option>
            </select>
          </div>
          {error && <div className="text-red-600">{error}</div>}
          <button disabled={creating} className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-60">{creating ? 'Reporting…' : 'Report capture'}</button>
        </form>
      </section>

      <section>
        <h2 className="text-xl">My Victims</h2>
        <ul className="mt-2 space-y-2">
          {victims.map(v => (
            <li key={v.id} className="border p-2 rounded">
                <div className="font-medium"><Link href={`/slave/victims/${v.id}`}>{v.name}</Link></div>
                <div className="text-sm text-gray-600">Estado: {v.status === 'CAPTURED' ? 'Capturado' : v.status === 'TRANSFORMING' ? 'En transformación' : 'Transformado'}</div>
                {v.skills && <div className="text-sm">Skills: {v.skills}</div>}
                <div className="text-xs text-gray-500">Captured by: {v.capturedBy}</div>
              </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
