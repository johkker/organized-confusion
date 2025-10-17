# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

## API Setup

The project includes a Prisma-based serverless API for events, DJs, and other data. Each endpoint is implemented as a Vercel serverless function. To use this API:

1. Make sure you have PostgreSQL installed and running
2. Create a `.env` file in the root directory with the following content:

```
# Database configuration
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/organized_confusion?schema=public"

# JWT for auth
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=24h

# Environment
NODE_ENV=development
```

3. Install dependencies if you haven't already:
```bash
npm install
```

4. Install the Vercel CLI if you haven't already:
```bash
npm install -g vercel
```

5. Generate the Prisma client:
```bash
npm run prisma:generate
```

6. Push the schema to your database:
```bash
npm run prisma:push
```

7. Seed the database with sample data:
```bash
npm run db:seed
```

8. Start the development server with Vercel:
```bash
npm run api:dev
```

The API will be available at http://localhost:3000/api

## API Endpoints

### Events
- `GET /api/events` - Get all events
- `GET /api/events?id=xxx` - Get event by ID

### DJs
- `GET /api/djs` - Get all DJs
- `GET /api/djs?id=xxx` - Get DJ by ID

### Users & Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/me` - Get current user profile (requires authentication)
- `PUT /api/users/me` - Update user profile (requires authentication)

### Authentication
Authentication is implemented using JWT (JSON Web Tokens). To make authenticated requests:

1. Login or register to get a token
2. Include the token in the Authorization header of your requests:
   ```
   Authorization: Bearer YOUR_TOKEN_HERE
   ```

## API Architecture

This project uses a serverless API architecture built on Vercel:

- Each API endpoint is implemented as a separate serverless function
- Functions are located in the `/api` directory (e.g., `/api/events/index.ts`)
- Authentication is handled using JWT tokens
- Database access is handled via Prisma ORM
- Database connections are established on-demand when functions are invoked

This approach provides several benefits:
- Better scalability with automatic scaling based on demand
- Lower costs as you only pay for what you use
- Improved reliability with automatic retries and redundancy
- Easier deployment through Vercel's platform
