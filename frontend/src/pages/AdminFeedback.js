import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';

function AdminFeedback() {
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const token = localStorage.getItem('jsv_token');
        const response = await fetch(`${process.env.REACT_APP_API_URL}/feedback`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener feedback');
        }

        const data = await response.json();
        setFeedback(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchFeedback();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('jsv_token');
      const res = await fetch(`${process.env.REACT_APP_API_URL}/feedback/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setFeedback((f) => f.filter((x) => x.id !== id));
      else console.error('Failed to delete feedback', await res.text());
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <h2>Admin Feedback</h2>
      <ul>
        {feedback.map((item) => (
          <li key={item.id}>
            <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(`${item.author || item.name || 'anon'}: ${item.message}`) }} />
            {' '}
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminFeedback;
