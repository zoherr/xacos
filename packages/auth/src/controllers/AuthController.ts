import type { XRequest, XResponse } from '@xacos/shared';
import { authService } from '../services/AuthService';

export class AuthController {
  static async register(req: XRequest, res: XResponse) {
    const body = req.body as { name?: string; email?: string; password?: string };

    if (!body.name || !body.email || !body.password) {
      return res.status(400).json({ success: false, error: 'name, email, and password are required' });
    }

    const { user, token } = await authService.register({
      name: body.name,
      email: body.email,
      password: body.password,
    });

    res.setCookie('xacos_token', token, {
      httpOnly: true,
      secure: process.env['APP_ENV'] === 'production',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
      sameSite: process.env['APP_ENV'] === 'production' ? 'strict' : 'lax',
    });

    return res.status(201).json({ success: true, user });
  }

  static async login(req: XRequest, res: XResponse) {
    const body = req.body as { email?: string; password?: string };

    if (!body.email || !body.password) {
      return res.status(400).json({ success: false, error: 'email and password are required' });
    }

    const { user, token } = await authService.login(body.email, body.password);

    res.setCookie('xacos_token', token, {
      httpOnly: true,
      secure: process.env['APP_ENV'] === 'production',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
      sameSite: process.env['APP_ENV'] === 'production' ? 'strict' : 'lax',
    });

    return res.json({ success: true, user });
  }

  static async logout(_req: XRequest, res: XResponse) {
    res.setCookie('xacos_token', '', {
      httpOnly: true,
      secure: process.env['APP_ENV'] === 'production',
      path: '/',
      maxAge: 0,
      sameSite: process.env['APP_ENV'] === 'production' ? 'strict' : 'lax',
    });

    return res.json({ success: true, message: 'Logged out' });
  }

  static async me(req: XRequest, res: XResponse) {
    return res.json({ success: true, user: req.user });
  }
}

