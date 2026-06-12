import { Router } from 'express';
const router = Router();
const events = [];  // In-memory store; replace with DB in production

router.post('/event', (req, res) => {
  const { event, properties, session_id } = req.body;
  if (!event) return res.status(400).json({ error: 'event required' });
  events.push({ event, properties, session_id, ts: Date.now() });
  res.json({ ok: true });
});

router.get('/events', (req, res) => {
  res.json(events.slice(-200));
});

export default router;
