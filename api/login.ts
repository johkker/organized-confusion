import { VercelRequest, VercelResponse } from '@vercel/node';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { config } from 'dotenv';
import prisma from './src/config/prisma';
import Joi from 'joi';

// Load environment variables
config();

// Validation schema
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
    );

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Validate request body
        const { error, value } = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email: value.email }
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const isPasswordValid = await compare(value.password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = sign(
            { id: user.id, email: user.email, isAdmin: user.admin },
            process.env.JWT_SECRET || 'default-secret-key'
        );

        // Remove password from response
        const { password, ...userWithoutPassword } = user;

        return res.json({
            user: userWithoutPassword,
            token
        });
    } catch (error) {
        console.error('Error logging in:', error);
        return res.status(500).json({ error: 'Failed to login' });
    }
} 