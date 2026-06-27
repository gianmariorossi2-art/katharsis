import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const q = (req.query.q as string || '').trim();
  if (!q) return res.status(400).json({ error: 'Missing query' });

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`;
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'Katharsis-App/1.0 (gianmariorossi2@gmail.com)' },
    });
    const data = await resp.json() as Array<{ lat: string; lon: string; display_name: string }>;
    if (!data.length) return res.status(404).json({ error: 'Place not found' });
    return res.json({ lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), name: data[0].display_name });
  } catch (err) {
    console.error('[geocode]', err);
    return res.status(500).json({ error: 'Geocoding failed' });
  }
}
