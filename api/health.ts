import { VercelRequest, VercelResponse } from '@vercel/node';

export function handler(_req: VercelRequest, res: VercelResponse) {
    res.status(200).json({ status: 'ok', message: 'API is running' });
} 