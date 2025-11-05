(async () => {
  const base = 'http://localhost:3001';
  const adminCreds = { email: 'admin@juansao.com', password: 'admin123' };
  const random = () => Date.now().toString().slice(-6);
  const headers = (token) => ({ 'Content-Type': 'application/json', Authorization: token ? `Bearer ${token}` : undefined });
  const r = async (url, opts) => {
    const res = await fetch(base + url, opts);
    const text = await res.text();
    let body;
    try { body = JSON.parse(text); } catch { body = text; }
    return { status: res.status, body };
  };

  console.log('Admin login');
  let res = await r('/auth/login', { method: 'POST', headers: headers(), body: JSON.stringify(adminCreds) });
  console.log(res.status, res.body);
  const adminToken = res.body.access_token || res.body.token || res.body?.accessToken;
  if (!adminToken) return console.error('no admin token');

  // Create a SLAVE user
  const slaveEmail = `slave-${random()}@example.com`;
  res = await r('/users', { method: 'POST', headers: headers(adminToken), body: JSON.stringify({ email: slaveEmail, password: 'slave123', role: 'SLAVE' }) });
  console.log('create slave', res.status, res.body);
  const slaveId = res.body.id;

  // Login as slave
  res = await r('/auth/login', { method: 'POST', headers: headers(), body: JSON.stringify({ email: slaveEmail, password: 'slave123' }) });
  console.log('slave login', res.status, res.body);
  const slaveToken = res.body.access_token || res.body.token || res.body?.accessToken;

  // Slave creates a victim
  res = await r('/victims', { method: 'POST', headers: headers(slaveToken), body: JSON.stringify({ name: 'Test Victim', skills: 'JS', status: 'CAPTURED' }) });
  console.log('create victim', res.status, res.body);
  const victimId = res.body.id;

  // Slave gets their victims
  res = await r('/victims/me', { method: 'GET', headers: headers(slaveToken) });
  console.log('my victims', res.status, res.body);

  // Admin creates a reward
  res = await r('/rewards', { method: 'POST', headers: headers(adminToken), body: JSON.stringify({ title: 'Gold Star' }) });
  console.log('create reward', res.status, res.body);
  const rewardId = res.body.id;

  // Admin assigns reward to slave
  res = await r(`/rewards/${rewardId}/assign`, { method: 'PUT', headers: headers(adminToken), body: JSON.stringify({ awardedTo: slaveId }) });
  console.log('assign reward', res.status, res.body);

  // Admin deletes reward
  res = await r(`/rewards/${rewardId}`, { method: 'DELETE', headers: headers(adminToken) });
  console.log('delete reward', res.status, res.body);

  // Admin deletes victim
  res = await r(`/victims/${victimId}`, { method: 'DELETE', headers: headers(adminToken) });
  console.log('delete victim', res.status, res.body);

  // Cleanup: delete slave user
  res = await r(`/users/${slaveId}`, { method: 'DELETE', headers: headers(adminToken) });
  console.log('delete slave', res.status, res.body);

  console.log('Full integration finished');
})();