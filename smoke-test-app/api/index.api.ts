import { XRouter } from '@xacos/core';

const router = new XRouter();

router.get('/', async (req, res) => {
  return res.json({
    message: 'Welcome to XAOCS API',
    version: '0.1.0'
  });
});

export default router;
