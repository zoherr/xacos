import { XRouter } from '@xacos/core';
import { AuthController } from '../controllers/AuthController';
import { authenticate } from '../middlewares/authenticate';
import { authRateLimit } from '../middlewares/authRateLimit';

export const router = new XRouter();

router.use(authRateLimit);

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', authenticate, AuthController.logout);
router.get('/me', authenticate, AuthController.me);


