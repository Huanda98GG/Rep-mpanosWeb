const axios = require('axios');

const base = 'http://localhost:3001';

describe('Auth API (smoke)', () => {
  test('login with seeded admin returns token', async () => {
    const res = await axios.post(`${base}/auth/login`, { email: 'admin@juansao.com', password: 'admin123' });
    expect(res.status).toBe(201);
    expect(res.data).toHaveProperty('access_token');
  });

  test('login with wrong password fails', async () => {
    try {
      await axios.post(`${base}/auth/login`, { email: 'admin@juansao.com', password: 'wrong' });
      throw new Error('Expected login to fail');
    } catch (e) {
      // If the backend returns a proper HTTP error, check status; otherwise fail with the error message
      const status = e?.response?.status;
      if (status) expect(status).toBe(401);
      else throw e;
    }
  }, 10000);
});
