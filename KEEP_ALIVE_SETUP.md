# Keep Alive Setup for Velour Platform

This guide explains how to set up automatic pinging to keep your Render service alive and prevent it from spinning down due to inactivity.

## 🎯 Why Keep Alive?

Render's free tier automatically spins down services after 15 minutes of inactivity. This causes:
- **50+ second delays** when users visit after inactivity
- **Poor user experience** with long loading times
- **Lost potential users** who leave due to slow loading

## 🚀 Solution: Automatic Pinging

The keep-alive service pings your Velour platform every 5 minutes to maintain activity.

## 📋 Setup Options

### Option 1: Local Computer (Recommended for Testing)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the keep-alive service:**
   ```bash
   npm run keep-alive
   ```

3. **Keep your computer running** - the service will ping every 5 minutes

### Option 2: External Service (Recommended for Production)

Use a free service like **UptimeRobot** or **Pingdom**:

#### UptimeRobot Setup:
1. Go to [UptimeRobot.com](https://uptimerobot.com)
2. Create a free account
3. Add a new monitor:
   - **Monitor Type:** HTTP(s)
   - **URL:** `https://videochat-wv3g.onrender.com/api/ping`
   - **Monitoring Interval:** 5 minutes
   - **Monitor Timeout:** 10 seconds
4. Save the monitor

#### Pingdom Setup:
1. Go to [Pingdom.com](https://pingdom.com)
2. Create a free account
3. Add a new check:
   - **Check Type:** HTTP
   - **URL:** `https://videochat-wv3g.onrender.com/api/ping`
   - **Check Interval:** 5 minutes
4. Save the check

### Option 3: GitHub Actions (Advanced)

Create a GitHub Action that runs every 5 minutes:

```yaml
# .github/workflows/keep-alive.yml
name: Keep Alive
on:
  schedule:
    - cron: '*/5 * * * *'  # Every 5 minutes
jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Service
        run: |
          curl -f https://videochat-wv3g.onrender.com/api/ping
```

## 🔧 Configuration

### Environment Variables

You can customize the keep-alive service by setting environment variables:

```bash
# Service URL (default: https://videochat-wv3g.onrender.com)
export SERVICE_URL=https://your-custom-domain.com

# Run the service
npm run keep-alive
```

### Ping Endpoint

The service pings: `https://videochat-wv3g.onrender.com/api/ping`

**Expected Response:**
```json
{
  "success": true,
  "message": "Pong! Service is alive",
  "timestamp": "2025-01-23T10:30:00.000Z",
  "uptime": 3600
}
```

## 📊 Monitoring

### Console Output

The keep-alive service provides colored console output:

- 🏓 **Blue:** Ping attempt
- ✅ **Green:** Successful ping
- ❌ **Red:** Failed ping
- ⚠️ **Yellow:** Warning

### Example Output:
```
[2025-01-23T10:30:00.000Z] 🚀 Starting Keep Alive service for Velour Platform
[2025-01-23T10:30:00.000Z] 📍 Service URL: https://videochat-wv3g.onrender.com
[2025-01-23T10:30:00.000Z] ⏰ Ping interval: 5 minutes
[2025-01-23T10:30:00.000Z] 🔗 Ping endpoint: /api/ping
[2025-01-23T10:30:00.000Z] 🏓 Pinging https://videochat-wv3g.onrender.com/api/ping
[2025-01-23T10:30:00.000Z] ✅ Ping successful - Pong! Service is alive
[2025-01-23T10:30:00.000Z]    Uptime: 60 minutes
```

## 🛠️ Troubleshooting

### Common Issues:

1. **Service not responding:**
   - Check if your Render service is running
   - Verify the URL is correct
   - Check Render logs for errors

2. **Ping failures:**
   - Network connectivity issues
   - Service temporarily down
   - Incorrect endpoint URL

3. **Service still spinning down:**
   - Verify ping interval is 5 minutes or less
   - Check that pings are actually reaching the service
   - Ensure the service is responding to pings

### Manual Testing:

Test the ping endpoint manually:
```bash
curl https://videochat-wv3g.onrender.com/api/ping
```

## 💡 Tips

1. **Use UptimeRobot** for the most reliable free solution
2. **Set up multiple monitors** for redundancy
3. **Monitor the logs** to ensure pings are working
4. **Test after deployment** to verify everything works

## 🎉 Benefits

With keep-alive active:
- ✅ **Instant loading** - no 50+ second delays
- ✅ **Better user experience** - fast response times
- ✅ **Higher conversion rates** - users don't leave due to slow loading
- ✅ **Professional appearance** - always responsive

Your Velour platform will now stay active and provide a smooth experience for all users! 🚀
