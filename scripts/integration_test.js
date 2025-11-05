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

  console.log('1) Admin login');
  let res = await r('/auth/login', { method: 'POST', headers: headers(), body: JSON.stringify(adminCreds) });
  console.log(res.status, res.body);
  if (res.status !== 201 && res.status !== 200) return console.error('Admin login failed');
  const adminToken = res.body.token || res.body.accessToken || res.body?.access_token;
  if (!adminToken) return console.error('No token from admin login');

  const tA = `devA-${random()}@example.com`;
  const tB = `devB-${random()}@example.com`;
  console.log('2) Create devA (admin)');
  res = await r('/users', { method: 'POST', headers: headers(adminToken), body: JSON.stringify({ email: tA, password: 'test123', role: 'DEVELOPER' }) });
  console.log(res.status, res.body);
  const devAId = res.body.id || res.body?.id;

  console.log('3) Create devB (admin)');
  res = await r('/users', { method: 'POST', headers: headers(adminToken), body: JSON.stringify({ email: tB, password: 'test123', role: 'DEVELOPER' }) });
  console.log(res.status, res.body);
  const devBId = res.body.id || res.body?.id;

  console.log('4) Login devA');
  res = await r('/auth/login', { method: 'POST', headers: headers(), body: JSON.stringify({ email: tA, password: 'test123' }) });
  console.log(res.status, res.body);
  const devAToken = res.body.token || res.body.accessToken || res.body?.access_token;

  console.log('5) devA create feedback (auth)');
  res = await r('/feedback/auth', { method: 'POST', headers: headers(devAToken), body: JSON.stringify({ message: 'Integration test feedback from devA' }) });
  console.log(res.status, res.body);
  const feedbackId = res.body.id || res.body?.id;

  console.log('6) Login devB');
  res = await r('/auth/login', { method: 'POST', headers: headers(), body: JSON.stringify({ email: tB, password: 'test123' }) });
  console.log(res.status, res.body);
  const devBToken = res.body.token || res.body.accessToken || res.body?.access_token;

  console.log('7) devB attempts to delete devA feedback (expect 403)');
  res = await r(`/feedback/${feedbackId}`, { method: 'DELETE', headers: headers(devBToken) });
  console.log(res.status, res.body);

  console.log('8) admin deletes feedback');
  res = await r(`/feedback/${feedbackId}`, { method: 'DELETE', headers: headers(adminToken) });
  console.log(res.status, res.body);

  console.log('9) admin deletes devA and devB users');
  if (devAId) { res = await r(`/users/${devAId}`, { method: 'DELETE', headers: headers(adminToken) }); console.log('delA', res.status); }
  if (devBId) { res = await r(`/users/${devBId}`, { method: 'DELETE', headers: headers(adminToken) }); console.log('delB', res.status); }

  console.log('10) admin logout (revoke token)');
  res = await r('/auth/logout', { method: 'POST', headers: headers(adminToken) });
  console.log(res.status, res.body);

  console.log('11) use revoked token to call GET /users (expect 401)');
  res = await r('/users', { method: 'GET', headers: headers(adminToken) });
  console.log(res.status, res.body);

  console.log('Integration script finished');
})();
