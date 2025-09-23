#!/usr/bin/env node

/**
 * Keep Alive Script for Velour Platform
 * Pings the service every 5 minutes to prevent Render from spinning down
 */

const https = require('https');
const http = require('http');

// Configuration
const SERVICE_URL = process.env.SERVICE_URL || 'https://videochat-wv3g.onrender.com';
const PING_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds
const PING_ENDPOINT = '/api/ping';

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  const timestamp = new Date().toISOString();
  console.log(`${colors[color]}[${timestamp}] ${message}${colors.reset}`);
}

function pingService() {
  const url = `${SERVICE_URL}${PING_ENDPOINT}`;
  const isHttps = url.startsWith('https://');
  const client = isHttps ? https : http;
  
  log(`🏓 Pinging ${url}`, 'blue');
  
  const req = client.get(url, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      if (res.statusCode === 200) {
        try {
          const response = JSON.parse(data);
          log(`✅ Ping successful - ${response.message}`, 'green');
          log(`   Uptime: ${Math.floor(response.uptime / 60)} minutes`, 'green');
        } catch (error) {
          log(`⚠️  Ping successful but invalid JSON response`, 'yellow');
        }
      } else {
        log(`❌ Ping failed with status: ${res.statusCode}`, 'red');
      }
    });
  });
  
  req.on('error', (error) => {
    log(`❌ Ping failed: ${error.message}`, 'red');
  });
  
  req.setTimeout(10000, () => {
    log(`❌ Ping timeout after 10 seconds`, 'red');
    req.destroy();
  });
}

function startKeepAlive() {
  log(`🚀 Starting Keep Alive service for Velour Platform`, 'green');
  log(`📍 Service URL: ${SERVICE_URL}`, 'blue');
  log(`⏰ Ping interval: ${PING_INTERVAL / 1000 / 60} minutes`, 'blue');
  log(`🔗 Ping endpoint: ${PING_ENDPOINT}`, 'blue');
  
  // Initial ping
  pingService();
  
  // Set up interval
  setInterval(pingService, PING_INTERVAL);
  
  log(`✅ Keep Alive service started successfully`, 'green');
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  log(`🛑 Keep Alive service stopped`, 'yellow');
  process.exit(0);
});

process.on('SIGTERM', () => {
  log(`🛑 Keep Alive service terminated`, 'yellow');
  process.exit(0);
});

// Start the service
startKeepAlive();
