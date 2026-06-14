import { Router, type Request, type Response } from 'express';
import { generateSection } from '../services/gemini';

const router = Router();

const VALID_SECTIONS = [
  'identity', 'uspAudience', 'market', 'competitors', 'swot',
  'businessModel', 'revenueStreams', 'fundingRequirement',
  'marketingChannels', 'investorPitch',
];

router.post('/', async (req: Request, res: Response) => {
  const { idea, domain, section } = req.body as {
    idea?: string;
    domain?: string;
    section?: string;
  };

  // Validate input
  if (!idea || typeof idea !== 'string' || idea.trim().replace(/\s/g, '').length < 10) {
    res.status(400).json({ error: 'Invalid or missing "idea" field (min 10 non-whitespace chars).' });
    return;
  }
  if (!domain || typeof domain !== 'string') {
    res.status(400).json({ error: 'Invalid or missing "domain" field.' });
    return;
  }
  if (!section || !VALID_SECTIONS.includes(section)) {
    res.status(400).json({ error: `Invalid "section". Must be one of: ${VALID_SECTIONS.join(', ')}` });
    return;
  }

  try {
    const data = await generateSection(idea.trim(), domain.trim(), section);
    res.json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);

    // Rate limit — pass retry delay to client
    if (message.startsWith('RATE_LIMIT:')) {
      const retryAfterMs = parseInt(message.split(':')[1], 10) || 60000;
      res.status(429).json({
        error: 'Rate limit reached. Please wait and retry.',
        retryAfterMs,
      });
      return;
    }

    console.error(`[API] /generate error for section "${section}":`, message);

    if (message.includes('Authentication failed')) {
      res.status(401).json({ error: message });
      return;
    }

    res.status(500).json({ error: `Failed to generate section "${section}". ${message}` });
  }
});

export default router;
