import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';

function AdminVictims() {
  const [victims, setVictims] = useState([]);

  useEffect(() => {
    const fetchVictims = async () => {
      try {
  const token = localStorage.getItem('jsv_token');
        const response = await fetch(`${process.env.REACT_APP_API_URL}/victims`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener las víctimas');
        }

        const data = await response.json();
        setVictims(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchVictims();
  }, []);

  return (
    <div>
      <h2>All Victims</h2>
      <ul>
        {victims.map((victim) => (
          <li
            key={victim.id}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(victim.name),
            }}
          ></li>
        ))}
      </ul>
    </div>
  );
}

export default AdminVictims;
