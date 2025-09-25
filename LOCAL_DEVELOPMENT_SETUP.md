# 🚀 Local Development Setup Guide

This guide will help you set up the Velour platform for local development and testing.

## Prerequisites

Before starting, make sure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/)

## Quick Start

### 1. Install Dependencies

```bash
# Install all dependencies (root, server, and client)
npm run install-all
```

### 2. Set Up Environment Variables

Create a `.env` file in the `server` directory:

```bash
cd server
cp env.example .env
```

Edit the `.env` file with your local configuration:

```env
# Server Configuration
NODE_ENV=development
PORT=5001

# Database (Local MongoDB)
MONGODB_URI=mongodb://localhost:27017/velour

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-jwt-key-for-local-development

# Stripe Configuration (optional for testing)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Cloudinary Configuration (optional for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:

**macOS (using Homebrew):**
```bash
brew services start mongodb-community
```

**Windows:**
```bash
# Start MongoDB service
net start MongoDB
```

**Linux:**
```bash
sudo systemctl start mongod
```

### 4. Start the Development Servers

```bash
# Start both server and client concurrently
npm run dev
```

This will start:
- **Backend Server**: http://localhost:5001
- **Frontend Client**: http://localhost:3000

## Alternative: Start Servers Separately

If you prefer to start servers separately:

### Terminal 1 - Backend Server:
```bash
npm run server
```

### Terminal 2 - Frontend Client:
```bash
npm run client
```

## Development URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **API Health Check**: http://localhost:5001/api/health
- **Socket.IO Test**: http://localhost:5001/api/socket-test

## Testing the Setup

### 1. Check Backend Health
Visit: http://localhost:5001/api/health

You should see:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-XX...",
  "uptime": 123.456,
  "memory": {...},
  "rooms": 0,
  "activeConnections": 0
}
```

### 2. Check Frontend
Visit: http://localhost:3000

You should see the Velour platform homepage.

### 3. Test API Connection
The frontend is configured to proxy API requests to the backend automatically.

## Features Available in Local Development

✅ **Social Media Feed** - Create and view posts with filters
✅ **Photo Filters** - Snapchat-like filters for images
✅ **Video Calling** - WebRTC video/voice calls
✅ **Messaging System** - Real-time chat
✅ **User Authentication** - Auth0 integration
✅ **File Uploads** - Images, videos, audio
✅ **Dashboard** - Full creator dashboard
✅ **User Discovery** - Find and follow other users

## Troubleshooting

### MongoDB Connection Issues

If you get MongoDB connection errors:

1. **Check if MongoDB is running:**
   ```bash
   # macOS/Linux
   brew services list | grep mongodb
   # or
   ps aux | grep mongod
   
   # Windows
   net start | findstr MongoDB
   ```

2. **Start MongoDB manually:**
   ```bash
   # macOS/Linux
   mongod --dbpath /usr/local/var/mongodb
   
   # Windows
   mongod --dbpath C:\data\db
   ```

### Port Already in Use

If you get "port already in use" errors:

1. **Kill processes on ports:**
   ```bash
   # Kill process on port 3000 (frontend)
   lsof -ti:3000 | xargs kill -9
   
   # Kill process on port 5001 (backend)
   lsof -ti:5001 | xargs kill -9
   ```

2. **Or change ports in configuration:**
   - Frontend: Edit `client/package.json` proxy setting
   - Backend: Edit `server/.env` PORT setting

### Dependencies Issues

If you have dependency issues:

```bash
# Clean install
rm -rf node_modules package-lock.json
rm -rf server/node_modules server/package-lock.json
rm -rf client/node_modules client/package-lock.json

# Reinstall
npm run install-all
```

### Environment Variables

Make sure your `.env` file is in the `server` directory and has the correct format:

```bash
# Check if .env exists
ls -la server/.env

# Check .env content (don't commit this!)
cat server/.env
```

## Development Workflow

### Making Changes

1. **Backend changes**: Edit files in `server/` directory
   - Server will auto-restart with nodemon
   - API changes are immediately available

2. **Frontend changes**: Edit files in `client/src/` directory
   - React will hot-reload automatically
   - UI changes are immediately visible

### Testing New Features

1. **API Testing**: Use the browser dev tools or Postman
2. **Database Testing**: Use MongoDB Compass or mongo shell
3. **Real-time Features**: Test with multiple browser tabs/windows

### Debugging

1. **Backend Logs**: Check the terminal running `npm run server`
2. **Frontend Logs**: Check browser dev tools console
3. **Network Requests**: Check browser dev tools Network tab

## Production vs Development

### Key Differences

- **Database**: Local MongoDB vs Cloud MongoDB
- **File Storage**: Local filesystem vs Cloudinary
- **Authentication**: Development vs Production Auth0
- **CORS**: Localhost vs Production domains
- **Error Handling**: Detailed errors vs User-friendly messages

### Switching to Production

When ready to deploy:

1. Update environment variables for production
2. Build the frontend: `npm run build`
3. Deploy to your hosting platform

## Additional Resources

- **MongoDB Documentation**: https://docs.mongodb.com/
- **Node.js Documentation**: https://nodejs.org/docs/
- **React Documentation**: https://reactjs.org/docs/
- **Socket.IO Documentation**: https://socket.io/docs/

## Support

If you encounter issues:

1. Check this troubleshooting guide
2. Check the browser console for errors
3. Check the server terminal for errors
4. Verify all prerequisites are installed
5. Ensure MongoDB is running

Happy coding! 🎉
