
import { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from './src/config/prisma';
export default async function handler(req: VercelRequest, res: VercelResponse) {
    const id = req.query.id as string | undefined;

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Access-Control-Max-Age', '86400');
        return res.status(204).end();
    }

    if (req.method !== 'GET') {
        res.setHeader('Allow', 'GET, OPTIONS');
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }

    try {
        if (!id) {
            const djs = await prisma.dJ.findMany();
            return res.status(200).json(djs);
        }

        const dj = await prisma.dJ.findUnique({
            where: { id },
            include: { events: true }
        });

        if (!dj) {
            return res.status(404).json({ error: 'DJ not found' });
        }

        return res.status(200).json(dj);
    } catch (error) {
        console.error('Error processing request:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}