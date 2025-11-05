import React, { useEffect, useState } from 'react';

export default function Rewards() {
  const [rewards, setRewards] = useState([]);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/rewards/public`);
        if (!res.ok) throw new Error('Failed to load rewards');
        const data = await res.json();
        setRewards(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchRewards();
  }, []);

  return (
    <div>
      <h2>Available Rewards</h2>
      {rewards.length === 0 ? (
        <p>No rewards yet.</p>
      ) : (
        <ul>
          {rewards.map(r => (
            <li key={r.id}>{r.title} — Awarded to: {r.awardedTo ?? '—'}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
