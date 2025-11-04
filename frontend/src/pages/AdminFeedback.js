import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';

function AdminFeedback() {
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    const fetchFeedback = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('/feedback', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setFeedback(data);
    };
    fetchFeedback();
  }, []);

  return (
    <div>
      <h2>Admin Feedback</h2>
      <ul>
        {feedback.map((item) => (
          <li key={item.id} dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(item.name + ': ' + item.message)}}></li>
        ))}
      </ul>
    </div>
  );
}

export default AdminFeedback;
