import Head from 'next/head'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken } from '../lib/auth';

function FeedbackSection() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const load = async () => {
    try {
      const r = await axios.get('http://localhost:3001/feedback');
      setFeedbacks(r.data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { load(); }, []);

  const submit = async (e: any) => {
    e.preventDefault();
    setStatus(null);
    try {
      const t = getToken();
      if (t) {
        await axios.post('http://localhost:3001/feedback/auth', { message }, { headers: { Authorization: `Bearer ${t}` } });
      } else {
        await axios.post('http://localhost:3001/feedback', { author: name, message });
      }
      setMessage(''); setName(''); setStatus('Sent');
      await load();
    } catch (err) {
      setStatus('Failed to send');
    }
  };

  return (
    <section className="mt-6">
      <h2 className="text-xl">Community Feedback</h2>
      <form onSubmit={submit} className="mt-2 card p-3 space-y-2">
        {!getToken() && (
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name (optional)" className="w-full border p-2" />
        )}
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Your story or feedback" className="w-full border p-2" />
        <button className="btn-primary">Send</button>
        {status && <div className="text-sm">{status}</div>}
      </form>

      <ul className="mt-4 space-y-2">
        {feedbacks.map(f => (
          <li key={f.id} className="card p-2">
            <div className="text-sm muted">{f.author || (f.authorUser && (f.authorUser.name || f.authorUser.email)) || 'Anonymous'}</div>
            <div className="mt-1">{f.message}</div>
            <div className="text-xs muted mt-2">{new Date(f.createdAt).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Developer Resistance</title>
      </Head>
      <main>
        <h1>Developer Resistance</h1>
        <p>This is an open-access page with tips and memes to resist becoming a data scientist.</p>
        <FeedbackSection />
      </main>
    </div>
  )
}
