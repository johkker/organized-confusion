import type { VercelRequest, VercelResponse } from '@vercel/node';
import prisma from './src/config/prisma';

// Define the handler function directly as the default export
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
        // GET /api/events – get all events
        if (!id) {
            const events = await prisma.event.findMany({
                include: {
                    djs: true
                }
            });
            return res.status(200).json(events);
        }

        // GET /api/events?id=XXX – get event by ID
        const event = await prisma.event.findUnique({
            where: { id },
            include: {
                djs: true
            }
        });

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        return res.status(200).json(event);
    } catch (error) {
        console.error('Error processing request:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
} 