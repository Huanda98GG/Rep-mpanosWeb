const axios = require('axios');

const base = 'http://localhost:3001';

describe('Victims API (smoke)', () => {
  test('slave can create victim and admin can list victims', async () => {
    // login as slave to create a victim
    const slaveLogin = await axios.post(`${base}/auth/login`, { email: 'slave1@juansao.com', password: 'slave123' });
    const slaveToken = slaveLogin.data.access_token;

    const createRes = await axios.post(`${base}/victims`, { name: 'Test Victim', skills: 'testing' }, { headers: { Authorization: `Bearer ${slaveToken}` } });
    expect(createRes.status).toBe(201);
    expect(createRes.data).toHaveProperty('id');

    // login as admin to list all victims
    const adminLogin = await axios.post(`${base}/auth/login`, { email: 'admin@juansao.com', password: 'admin123' });
    const adminToken = adminLogin.data.access_token;

    const listRes = await axios.get(`${base}/victims`, { headers: { Authorization: `Bearer ${adminToken}` } });
    expect(listRes.status).toBe(200);
    expect(Array.isArray(listRes.data)).toBe(true);
  }, 20000);
});
