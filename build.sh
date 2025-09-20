#!/bin/bash

echo "🚀 Starting build process..."

# Install all dependencies
echo "📦 Installing dependencies..."
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..

# Build the React app
echo "🔨 Building React app..."
cd client && npm run build && cd ..

# Copy build files to root directory for Render
echo "📋 Copying build files to root directory..."
if [ -d "client/build" ]; then
  cp -r client/build/* ./
  echo "✅ Build files copied to root directory"
else
  echo "❌ Build directory not found"
fi

# Copy server files to root directory for Render
echo "📋 Copying server files to root directory..."
if [ -d "server" ]; then
  cp -r server/* ./
  echo "✅ Server files copied to root directory"
else
  echo "❌ Server directory not found"
fi

# Install server dependencies in root directory
echo "📦 Installing server dependencies in root directory..."
npm install express socket.io cors uuid
echo "✅ Server dependencies installed in root directory"

echo "✅ Build completed successfully!"
echo "📁 Build directory contents:"
ls -la client/build/ || echo "Build directory not found"
echo "📁 Root directory contents:"
ls -la ./

echo "🎯 Ready for deployment!"
