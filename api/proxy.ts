import type { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

const TARGET_URL = 'https://example.com'; // Replace with your backend target

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const path = req.url?.replace(/^\/api\/proxy/, '') || '';
  const url = `${TARGET_URL}${path}`;

  try {
    const response = await fetch(url, {
      method: req.method,
      headers: req.headers as any,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
    });

    const buffer = await response.buffer();

    res.status(response.status);
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });
    res.send(buffer);
  } catch (err: any) {
    res.status(500).json({ error: 'Proxy error', details: err.message });
  }
}
