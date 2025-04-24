import { VercelRequest, VercelResponse } from '@vercel/node';
import { hash } from 'bcryptjs';
import { config } from 'dotenv';
import prisma from './src/config/prisma';
import jwt from 'jsonwebtoken';

// Load environment variables
config();

// Get auth token from request
function getAuthToken(req: VercelRequest): string | null {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.substring(7);
}

// Verify JWT token
function verifyToken(token: string): { id: string; email: string; isAdmin: boolean } | null {
    try {
        return jwt.verify(token, process.env.JWT_SECRET || 'default-secret-key') as { id: string; email: string; isAdmin: boolean };
    } catch (error) {
        return null;
    }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Verify authentication
    const token = getAuthToken(req);
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ error: 'Invalid token' });
    }

    // GET /api/me - Get current user profile
    if (req.method === 'GET') {
        try {
            const user = await prisma.user.findUnique({
                where: { id: decoded.id },
                include: {
                    tickets: true,
                    albums: true
                }
            });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Remove password from response
            const { password, ...userWithoutPassword } = user;
            return res.json(userWithoutPassword);
        } catch (error) {
            console.error('Error getting user profile:', error);
            return res.status(500).json({ error: 'Failed to get user profile' });
        }
    }

    // PUT /api/me - Update current user profile
    if (req.method === 'PUT') {
        try {
            const user = await prisma.user.findUnique({
                where: { id: decoded.id }
            });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Create update data object
            const updateData: Record<string, any> = {};

            // Fields that can be updated
            const updatableFields = ['name', 'whatsappNumber', 'zipcode'];
            let hasChanges = false;

            for (const field of updatableFields) {
                if (req.body[field] !== undefined) {
                    updateData[field] = req.body[field];
                    hasChanges = true;
                }
            }

            if (req.body.password) {
                updateData.password = await hash(req.body.password, 10);
                hasChanges = true;
            }

            if (!hasChanges) {
                return res.status(400).json({ error: 'No valid fields to update' });
            }

            // Save updated user
            const updatedUser = await prisma.user.update({
                where: { id: decoded.id },
                data: updateData
            });

            // Remove password from response
            const { password, ...userWithoutPassword } = updatedUser;

            return res.json(userWithoutPassword);
        } catch (error) {
            console.error('Error updating user profile:', error);
            return res.status(500).json({ error: 'Failed to update user profile' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
} 