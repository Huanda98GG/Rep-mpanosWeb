const axios = require('axios');

const BASE = process.env.BASE_URL || 'http://localhost:3001';

async function run() {
  try {
    console.log('E2E: login admin');
    const adminLogin = await axios.post(`${BASE}/auth/login`, { email: 'admin@juansao.com', password: 'admin123' });
    const adminToken = adminLogin.data.access_token;

    console.log('E2E: login slave');
    const slaveLogin = await axios.post(`${BASE}/auth/login`, { email: 'slave1@juansao.com', password: 'slave123' });
    const slaveToken = slaveLogin.data.access_token;
    const slavePayload = parseJwt(slaveToken);
    const slaveId = slavePayload && slavePayload.sub;

    console.log('E2E: slave creates a victim');
    const victimRes = await axios.post(`${BASE}/victims`, { name: `E2E Victim ${Date.now()}`, skills: 'e2e' }, { headers: { Authorization: `Bearer ${slaveToken}` } });
    if (victimRes.status !== 201) throw new Error('Failed to create victim');

    console.log('E2E: admin creates a reward');
    const rewardRes = await axios.post(`${BASE}/rewards`, { title: `E2E Reward ${Date.now()}` }, { headers: { Authorization: `Bearer ${adminToken}` } });
    if (rewardRes.status !== 201) throw new Error('Failed to create reward');
    const rewardId = rewardRes.data.id;

    console.log('E2E: admin assigns reward to slave');
    const assignRes = await axios.put(`${BASE}/rewards/${rewardId}/assign`, { awardedTo: slaveId }, { headers: { Authorization: `Bearer ${adminToken}` } });
    if (assignRes.status !== 200) throw new Error('Failed to assign reward');

    console.log('E2E: admin fetches leaderboard');
    const lb = await axios.get(`${BASE}/stats/leaderboard`, { headers: { Authorization: `Bearer ${adminToken}` } });
    if (lb.status !== 200) throw new Error('Failed to get leaderboard');

    console.log('E2E: submit public feedback');
    const fb = await axios.post(`${BASE}/feedback`, { author: 'E2E Bot', message: 'End-to-end smoke test' });
    if (![200,201].includes(fb.status)) throw new Error('Failed to post feedback');

    console.log('E2E: all checks passed');
    process.exit(0);
  } catch (err) {
    console.error('E2E: failed', err.message || err);
    if (err.response) console.error('response', err.response.status, err.response.data);
    process.exit(1);
  }
}

function parseJwt(token) {
  try {
    const parts = token.split('.');
    const payload = Buffer.from(parts[1], 'base64').toString('utf8');
    return JSON.parse(payload);
  } catch (e) {
    return null;
  }
}

run();
