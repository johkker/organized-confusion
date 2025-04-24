/*
 * DEPRECATED: This Express server approach is no longer used.
 * The API has been refactored to use Vercel serverless functions.
 * Each endpoint is now implemented as a separate serverless function in the api/ directory.
 * This file is kept for reference purposes only.
 */

import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { VercelRequest, VercelResponse } from '@vercel/node';
import AppDataSource from './src/config/data-source';

// Load environment variables
config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database initialization
let initialized = false;

async function initializeDB() {
    if (!initialized) {
        try {
            await AppDataSource.initialize();
            console.log('Database connection established');
            initialized = true;
        } catch (error) {
            console.error('Error connecting to database:', error);
        }
    }
}

// Middleware to ensure DB is initialized
app.use(async (_req, _res, next) => {
    await initializeDB();
    next();
});

// Health check endpoint
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', message: 'API is running' });
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// Redirects to inform users about the serverless architecture
app.use('*', (_req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: 'This application uses serverless functions. Please access the API via /api/[endpoint]'
    });
});

// For local development (using vercel dev instead)
if (process.env.NODE_ENV === 'development') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Handler for Vercel serverless function
export default async function handler(req: VercelRequest, res: VercelResponse) {
    await initializeDB();
    return app(req, res);
} 