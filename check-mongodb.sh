#!/bin/bash

# Check MongoDB status
echo "🔍 Checking MongoDB status..."

# Check if MongoDB process is running
if pgrep -x "mongod" > /dev/null; then
    echo "✅ MongoDB is running"
    
    # Try to connect to MongoDB
    if mongosh --eval "db.runCommand('ping')" --quiet > /dev/null 2>&1; then
        echo "✅ MongoDB connection successful"
        echo "📊 Database: mongodb://localhost:27017/velour"
    else
        echo "⚠️  MongoDB process is running but connection failed"
        echo "   Try: mongosh --eval 'db.runCommand(\"ping\")'"
    fi
else
    echo "❌ MongoDB is not running"
    echo ""
    echo "To start MongoDB:"
    echo "  macOS (Homebrew): brew services start mongodb-community"
    echo "  macOS (Manual):   mongod --dbpath /usr/local/var/mongodb"
    echo "  Windows:          net start MongoDB"
    echo "  Linux:            sudo systemctl start mongod"
    echo ""
    echo "Or install MongoDB:"
    echo "  macOS: brew install mongodb-community"
    echo "  Windows: Download from https://www.mongodb.com/try/download/community"
    echo "  Linux: sudo apt-get install mongodb"
fi
