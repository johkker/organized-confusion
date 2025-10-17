# Organized Confusion API

This is the serverless API for the Organized Confusion project, built with TypeORM, PostgreSQL, and Express.

## Tech Stack

- TypeScript
- Express.js
- TypeORM
- PostgreSQL
- JWT Authentication
- Cloudinary for image storage
- Vercel Serverless Functions

## Database Schema

The API includes the following entities:

- **User**: Account information for application users
- **Buyer**: Information for ticket purchasers (may or may not be linked to a User account)
- **Event**: Event details including lineup, location, and ticket information
- **DJ**: Information about DJs, including genres and media links
- **Ticket**: Ticket purchases linking events, buyers, and users
- **Album**: Photo albums for events
- **AlbumImage**: Individual images within an album

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file with the following variables:
   ```
   # Database Configuration - Option 1: Individual parameters
   DB_HOST=your-postgres-host
   DB_PORT=5432
   DB_USERNAME=your-username
   DB_PASSWORD=your-password
   DB_DATABASE=your-database-name
   
   # Database Configuration - Option 2: Connection string (recommended)
   # DATABASE_URL=postgresql://username:password@host:port/database

   # JWT Authentication
   JWT_SECRET=your-jwt-secret-key
   JWT_EXPIRES_IN=24h

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret

   # API URL
   API_URL=http://localhost:3000/api

   # Node Environment
   NODE_ENV=development
   ```

3. Run migrations:
   ```
   npm run migration:run
   ```

## Deployment

The API is automatically deployed to Vercel when changes are pushed to the main branch.

## API Endpoints

### Authentication

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login and receive JWT token

### Users

- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update current user profile
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

### Events

- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create new event (admin only)
- `PUT /api/events/:id` - Update event (admin only)
- `DELETE /api/events/:id` - Delete event (admin only)

### DJs

- `GET /api/djs` - Get all DJs
- `GET /api/djs/:id` - Get DJ by ID
- `POST /api/djs` - Create new DJ (admin only)
- `PUT /api/djs/:id` - Update DJ (admin only)
- `DELETE /api/djs/:id` - Delete DJ (admin only)

### Tickets

- `GET /api/tickets` - Get all tickets (admin only)
- `GET /api/tickets/my` - Get current user's tickets
- `GET /api/tickets/:id` - Get ticket by ID
- `POST /api/tickets` - Purchase a ticket
- `PUT /api/tickets/:id/use` - Mark ticket as used (admin only)
- `PUT /api/tickets/:id/cancel` - Cancel ticket (admin only)

### Albums

- `GET /api/albums` - Get all public albums
- `GET /api/albums/my` - Get current user's albums
- `GET /api/albums/:id` - Get album by ID
- `POST /api/albums` - Create new album
- `PUT /api/albums/:id` - Update album
- `DELETE /api/albums/:id` - Delete album
- `POST /api/albums/:id/images` - Add images to album
- `DELETE /api/albums/:albumId/images/:imageId` - Delete image from album 