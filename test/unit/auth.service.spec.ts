import { AuthService } from '../../src/auth/auth.service';

describe('AuthService (unit)', () => {
  test('login returns token and validateUser returns user when password matches', async () => {
    // mock UsersService
    const passwordPlain = 'secret123';
    const bcrypt = await import('bcrypt');
    const hashed = await bcrypt.hash(passwordPlain, 10);
    const mockUsersService: any = {
      findByEmail: jest.fn().mockResolvedValue({ id: 1, email: 'a@b.com', password: hashed, role: 'DEVELOPER' }),
    };

    const svc = new AuthService(mockUsersService);
    const valid = await svc.validateUser('a@b.com', passwordPlain);
    expect(valid).not.toBeNull();
    expect(valid).not.toHaveProperty('password');

    const loginRes = await svc.login({ id: 1, email: 'a@b.com', role: 'DEVELOPER' });
    expect(loginRes).toHaveProperty('access_token');
  });

  test('validateUser returns null for wrong password or missing user', async () => {
    const bcrypt = await import('bcrypt');
    const hashed = await bcrypt.hash('other', 10);
    const mockUsersService: any = {
      findByEmail: jest.fn().mockResolvedValue({ id: 2, email: 'x@y.com', password: hashed }),
    };
    const svc = new AuthService(mockUsersService);
    const invalid = await svc.validateUser('x@y.com', 'not-the-right');
    expect(invalid).toBeNull();

    // missing user
    const mockUsersService2: any = { findByEmail: jest.fn().mockResolvedValue(null) };
    const svc2 = new AuthService(mockUsersService2);
    const missing = await svc2.validateUser('no@one.com', 'whatever');
    expect(missing).toBeNull();
  });
});
