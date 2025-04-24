import { verify } from 'jsonwebtoken';
import { VercelRequest } from '@vercel/node';

export interface DecodedToken {
    id: string;
    email: string;
    isAdmin: boolean;
}

export function getAuthToken(req: VercelRequest): string | null {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    return authHeader.split(' ')[1];
}

export function verifyToken(token: string): DecodedToken | null {
    try {
        // Verify token
        const decoded = verify(
            token,
            process.env.JWT_SECRET || 'default-secret-key'
        ) as DecodedToken;

        return decoded;
    } catch (error) {
        return null;
    }
} 