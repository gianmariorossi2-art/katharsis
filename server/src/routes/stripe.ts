import { Router, Request, Response } from 'express';

const router = Router();

// POST /api/stripe/checkout
// Placeholder — replace with real Stripe integration when ready
router.post('/checkout', (req: Request, res: Response): void => {
  const { priceId = 'price_placeholder', userId = 'unknown' } = req.body as {
    priceId?: string;
    userId?: string;
  };

  console.log(`[Stripe] Mock checkout requested — priceId: ${priceId}, userId: ${userId}`);

  res.json({
    url: 'https://checkout.stripe.com/mock',
    sessionId: 'mock_session_' + Date.now(),
  });
});

// POST /api/stripe/webhook
// Placeholder — replace with real Stripe webhook verification when ready
router.post('/webhook', (req: Request, res: Response): void => {
  console.log('[Stripe] Webhook received:', JSON.stringify(req.body, null, 2));
  res.json({ received: true });
});

export default router;
