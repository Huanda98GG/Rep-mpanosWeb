import React, { useState } from 'react';

function Feedback() {
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('jsv_token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }), // agrega el token si existe
        },
        // backend expects `message` field for feedback
        body: JSON.stringify({ message: feedback }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar el feedback');
      }

      const data = await response.json();
      if (data.id) {
        alert('✅ Feedback enviado con éxito!');
        setFeedback('');
      } else {
        alert('❌ No se pudo enviar el feedback');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un problema al enviar tu feedback');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Submit Feedback</h2>
      <textarea
        placeholder="Your feedback"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
      ></textarea>
      <button type="submit">Submit</button>
    </form>
  );
}

export default Feedback;
