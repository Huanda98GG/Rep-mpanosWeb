import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(email: string, pass: string) {
    const user: any = await this.usersService.findByEmail(email);
    if (!user) return null;
    // password compare - bcrypt required
    const bcrypt = await import('bcrypt');
    const match = await bcrypt.compare(pass, user.password);
    if (match) {
      const { password, ...rest } = user;
      return rest;
    }
    return null;
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'replace-me-with-secure-secret', { expiresIn: '1h' });
    return { access_token: token };
  }
}
