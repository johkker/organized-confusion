import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
    // Return a simple test response
    res.status(200).json({
        message: 'Serverless API is working!',
        timestamp: new Date().toISOString(),
        method: req.method,
        query: req.query,
        env: process.env.NODE_ENV || 'development'
    });
} 