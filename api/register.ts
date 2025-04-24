import { VercelRequest, VercelResponse } from '@vercel/node';
import { hash } from 'bcryptjs';
import { config } from 'dotenv';
import prisma from './src/config/prisma';
import Joi from 'joi';

// Load environment variables
config();

// Validation schema
const userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    whatsappNumber: Joi.string().required(),
    zipcode: Joi.string().required(),
    cpf: Joi.string().required(),
    dateOfBirth: Joi.date().iso().required()
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
        const { error, value } = userSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        // Check if user with email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: value.email }
        });

        if (existingUser) {
            return res.status(409).json({ error: 'Email already in use' });
        }

        // Check if user with CPF already exists
        const existingCpf = await prisma.user.findFirst({
            where: { cpf: value.cpf }
        });

        if (existingCpf) {
            return res.status(409).json({ error: 'CPF already registered' });
        }

        // Hash password
        const hashedPassword = await hash(value.password, 10);

        // Create new user
        const user = await prisma.user.create({
            data: {
                ...value,
                password: hashedPassword
            }
        });

        // Remove password from response
        const { password, ...userWithoutPassword } = user;

        return res.status(201).json(userWithoutPassword);
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ error: 'Failed to create user' });
    }
} 