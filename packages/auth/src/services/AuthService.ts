import bcrypt from 'bcryptjs';
import { sign, verify, type JwtPayload } from 'jsonwebtoken';
import { User } from '../models/User';
import { requireEnv } from '@xacos/config';

export interface AuthTokenPayload {
  userId: number;
  role: string;
  iat?: number;
  exp?: number;
}

export interface AuthResult {
  user: User;
  token: string;
}

/**
 * Service for handling authentication logic.
 */
export class AuthService {
  private get jwtSecret(): string {
    return requireEnv('JWT_SECRET');
  }

  private get jwtExpiresIn(): string {
    return process.env['JWT_EXPIRES_IN'] ?? '7d';
  }

  /**
   * Register a new user.
   */
  async register(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<AuthResult> {
    // Check duplicate email
    const existing = await User.where('email', data.email).first();
    if (existing) {
      throw Object.assign(new Error('Email already registered'), { statusCode: 409 });
    }

    const BCRYPT_ROUNDS = Math.max(12, Number(process.env['BCRYPT_ROUNDS'] ?? 12));
    const created = await User.create({
      name: data.name,
      email: data.email,
      password: await bcrypt.hash(data.password, BCRYPT_ROUNDS),
      role: 'user',
      email_verified: false,
      email_verified_at: null,
    });

    const user = Object.assign(new User(), created) as User;

    const token = this.generateToken(user);
    return { user, token };

  }

  /**
   * Authenticate a user by email and password.
   */
  async login(email: string, password: string): Promise<AuthResult> {
    const row = (await User.where('email', email).first()) as Record<string, unknown> | null;

    if (!row) {
      throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
    }
    const user = Object.assign(new User(), row) as User;

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
    }

    const token = this.generateToken(user);
    return { user, token };
  }

  /**
   * Generate a JWT for the given user.
   */
  generateToken(user: User): string {
    const payload: AuthTokenPayload = {
      userId: user.id,
      role: user.role,
    };
    // `jsonwebtoken` types are occasionally incompatible across environments; use a focused cast here.
    const _sign = sign as unknown as (p: unknown, s: unknown, o?: unknown) => string;
    return _sign(payload, this.jwtSecret, { expiresIn: this.jwtExpiresIn });

  }

  /**
   * Verify and decode a JWT.
   */
  verifyToken(token: string): AuthTokenPayload {
    const _verify = verify as unknown as (t: unknown, s: unknown) => unknown;
    return _verify(token, this.jwtSecret) as AuthTokenPayload;
  }
}

// Singleton for use without container
export const authService = new AuthService();

