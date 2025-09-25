#!/bin/bash

# Velour Local Development Startup Script
echo "🚀 Starting Velour Local Development Environment..."

# Check if MongoDB is running
echo "📊 Checking MongoDB status..."
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first:"
    echo "   macOS: brew services start mongodb-community"
    echo "   Windows: net start MongoDB"
    echo "   Linux: sudo systemctl start mongod"
    echo ""
    echo "Or start manually:"
    echo "   mongod --dbpath /usr/local/var/mongodb"
    exit 1
fi

echo "✅ MongoDB is running"

# Check if .env file exists
if [ ! -f "server/.env" ]; then
    echo "📝 Creating .env file from template..."
    cp server/env.example server/.env
    echo "✅ .env file created. Please edit server/.env with your configuration."
fi

# Install dependencies if needed
echo "📦 Checking dependencies..."
if [ ! -d "node_modules" ] || [ ! -d "server/node_modules" ] || [ ! -d "client/node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm run install-all
fi

echo "✅ Dependencies are ready"

# Start the development servers
echo "🎯 Starting development servers..."
echo "   Backend: http://localhost:5001"
echo "   Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

npm run dev
