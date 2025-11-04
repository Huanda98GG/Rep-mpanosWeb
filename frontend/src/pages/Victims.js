import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';

function Victims() {
  const [victims, setVictims] = useState([]);

  useEffect(() => {
    const fetchVictims = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('/victims/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setVictims(data);
    };
    fetchVictims();
  }, []);

  return (
    <div>
      <h2>My Victims</h2>
      <ul>
        {victims.map((victim) => (
          <li key={victim.id} dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(victim.name)}}></li>
        ))}
      </ul>
    </div>
  );
}

export default Victims;
