// Home.js
import React from 'react';
import { useEffect, useState } from 'react';

function FeedbackList() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/feedback`);
        if (!res.ok) return;
        const data = await res.json();
        setItems(data);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);
  if (!items.length) return <p>No feedback yet.</p>;
  return (
    <ul>
      {items.map(f => (
        <li key={f.id}><strong>{f.author || 'anon'}</strong>: {f.message}</li>
      ))}
    </ul>
  );
}

function Home() {
  // Si algún día necesitas obtener datos del backend desde esta página,
  // puedes hacerlo así:
  // const baseUrl = process.env.REACT_APP_API_URL;

  return (
    <div>
      <h1>Welcome to Mpanos Web</h1>
      <p>This is the home page.</p>
      <section>
        <h2>Recent Feedback</h2>
        <FeedbackList />
      </section>
    </div>
  );
}

export default Home;
