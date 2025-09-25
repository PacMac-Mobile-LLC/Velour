#!/usr/bin/env node

/**
 * Keep-Alive Service for Render Backend
 * Pings the server every 5 minutes to prevent 15-minute timeout
 */

const https = require('https');
const http = require('http');

// Configuration
const PING_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds
const BACKEND_URL = process.env.BACKEND_URL || 'https://videochat-wv3g.onrender.com';
const PING_ENDPOINT = '/api/ping';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  const timestamp = new Date().toISOString();
  console.log(`${colors[color]}${colors.bright}[${timestamp}]${colors.reset} ${colors[color]}${message}${colors.reset}`);
}

function pingServer() {
  const url = `${BACKEND_URL}${PING_ENDPOINT}`;
  const isHttps = url.startsWith('https://');
  const client = isHttps ? https : http;
  
  log(`🔄 Pinging server: ${url}`, 'blue');
  
  const req = client.get(url, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 200) {
        try {
          const response = JSON.parse(data);
          log(`✅ Ping successful! Server responded: ${response.message}`, 'green');
          log(`   Uptime: ${Math.round(response.uptime)}s`, 'cyan');
        } catch (error) {
          log(`⚠️  Ping successful but invalid JSON response`, 'yellow');
        }
      } else {
        log(`❌ Ping failed with status: ${res.statusCode}`, 'red');
      }
    });
  });
  
  req.on('error', (error) => {
    log(`❌ Ping failed with error: ${error.message}`, 'red');
  });
  
  req.setTimeout(30000, () => {
    log(`⏰ Ping timeout after 30 seconds`, 'yellow');
    req.destroy();
  });
}

function startKeepAlive() {
  log(`🚀 Starting Keep-Alive service for Velour backend`, 'magenta');
  log(`📍 Backend URL: ${BACKEND_URL}`, 'cyan');
  log(`⏱️  Ping interval: ${PING_INTERVAL / 1000 / 60} minutes`, 'cyan');
  log(`🎯 Ping endpoint: ${PING_ENDPOINT}`, 'cyan');
  
  // Initial ping
  pingServer();
  
  // Set up interval
  const interval = setInterval(pingServer, PING_INTERVAL);
  
  // Graceful shutdown
  process.on('SIGINT', () => {
    log(`\n🛑 Shutting down Keep-Alive service...`, 'yellow');
    clearInterval(interval);
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    log(`\n🛑 Shutting down Keep-Alive service...`, 'yellow');
    clearInterval(interval);
    process.exit(0);
  });
  
  log(`✅ Keep-Alive service started successfully!`, 'green');
  log(`💡 Press Ctrl+C to stop the service`, 'yellow');
}

// Start the service
startKeepAlive();