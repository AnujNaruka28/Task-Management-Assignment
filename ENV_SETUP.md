# Task Management Application - Environment Setup

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
MONGODB_URI=mongodb://localhost:27017/task_management
JWT_SECRET=your_super_secure_jwt_secret_key_change_this_in_production
NODE_ENV=development
```

### Variable Descriptions:

- **MONGODB_URI**: MongoDB connection string. Update with your MongoDB instance URL.
- **JWT_SECRET**: Secret key for signing JWT tokens. **MUST** be changed in production.
- **NODE_ENV**: Environment mode (`development` or `production`). Rate limiting is disabled in development.

## Security Notes:

1. Never commit `.env.local` to version control
2. Generate a secure JWT_SECRET for production using:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
3. Use environment-specific MongoDB URIs for production
4. Rate limiting is active only in production mode

## Getting Started:

1. Copy `env.example.txt` contents to `.env.local`
2. Update the values with your actual configuration
3. Install dependencies: `npm install`
4. Run development server: `npm run dev`
