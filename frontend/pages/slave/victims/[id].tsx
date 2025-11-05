import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from '../../../lib/auth';

export default function VictimPage() {
  const router = useRouter();
  const { id } = router.query;
  const [victim, setVictim] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const t = getToken();
        const headers = t ? { Authorization: `Bearer ${t}` } : undefined;
        const r = await axios.get(`http://localhost:3001/victims/${id}`, { headers });
        setVictim(r.data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [id]);

  if (!victim) return <main className="p-6">Loading…</main>;

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl mb-2">Victim: {victim.name}</h1>
      <div className="card p-4">
        <p><strong>Skills:</strong> {victim.skills || '—'}</p>
        <p><strong>Last seen:</strong> {victim.lastSeen ? new Date(victim.lastSeen).toLocaleString() : 'Unknown'}</p>
        <p><strong>Capture status:</strong> {victim.status}</p>
        <p><strong>Transformation target:</strong> {victim.transformationTarget || 'Unknown'}</p>
        <p className="text-sm text-gray-600 mt-2">Captured by: {victim.capturedBy}</p>
      </div>
    </main>
  );
}
