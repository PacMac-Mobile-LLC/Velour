# API Connection Troubleshooting Guide

This guide addresses the major API connection and CORS issues that were causing the dashboard to fail.

## 🚨 Issues Identified

### 1. **Wrong API URL**
- **Problem**: Frontend was trying to connect to `videochat-wv3g.onrender.com` instead of `velour-wxv9.onrender.com`
- **Symptoms**: All API calls failing with `ERR_NETWORK` errors
- **Root Cause**: Cached environment variables or incorrect build configuration

### 2. **CORS Policy Violations**
- **Problem**: Backend wasn't allowing requests from `https://www.vibecodes.space`
- **Symptoms**: `Access to fetch at '...' has been blocked by CORS policy`
- **Root Cause**: Missing `www.vibecodes.space` in CORS origins

### 3. **File Upload Failures**
- **Problem**: Upload functionality completely broken
- **Symptoms**: "Failed to upload file" errors
- **Root Cause**: Combination of wrong API URL and CORS issues

## ✅ Solutions Implemented

### 1. **Fixed API URL Configuration**
```bash
# Created client/.env.local with correct API URL
REACT_APP_API_URL=https://velour-wxv9.onrender.com/api
```

### 2. **Updated CORS Configuration**
```javascript
// server/index.js - Added www.vibecodes.space to allowed origins
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [
        "https://vibecodes.space",
        "https://www.vibecodes.space",  // ← Added this
        "https://velour-wxv9.onrender.com",
        process.env.FRONTEND_URL
      ].filter(Boolean)
    : "http://localhost:3000",
  credentials: true
}));
```

### 3. **Rebuilt Frontend**
- Rebuilt with correct environment variables
- Ensured all API calls use the correct backend URL

## 🔍 Error Analysis

### Network Errors
```
GET https://videochat-wv3g.onrender.com/api/dashboard/stats net::ERR_FAILED
```
**Cause**: Wrong API URL in frontend configuration
**Fix**: Updated environment variables and rebuilt

### CORS Errors
```
Access to fetch at 'https://videochat-wv3g.onrender.com/api/...' from origin 'https://www.vibecodes.space' has been blocked by CORS policy
```
**Cause**: Backend not allowing requests from www.vibecodes.space
**Fix**: Added www.vibecodes.space to CORS origins

### Upload Errors
```
Error uploading file to vault: Network Error
```
**Cause**: Combination of wrong API URL and CORS issues
**Fix**: Fixed both API URL and CORS configuration

## 🛠️ Prevention Measures

### 1. **Environment Variable Management**
- Always use `.env.local` for local development
- Ensure production builds use correct environment variables
- Document all required environment variables

### 2. **CORS Configuration**
- Include all possible frontend URLs in CORS origins
- Test with both `www` and non-`www` versions
- Include development and production URLs

### 3. **API URL Validation**
- Verify API URLs in browser network tab
- Check that frontend is connecting to correct backend
- Monitor for any hardcoded URLs in codebase

## 🧪 Testing Checklist

### API Connection Test
- [ ] Dashboard loads without network errors
- [ ] All tabs (Notifications, Messages, Collections, etc.) load data
- [ ] No CORS errors in browser console
- [ ] File upload functionality works

### CORS Test
- [ ] Requests from `https://vibecodes.space` work
- [ ] Requests from `https://www.vibecodes.space` work
- [ ] No "blocked by CORS policy" errors

### Upload Test
- [ ] Can select files in Vault tab
- [ ] Upload modal opens correctly
- [ ] Files upload successfully
- [ ] No "Failed to upload file" errors

## 🔧 Debugging Steps

### 1. **Check Browser Network Tab**
- Look for failed requests (red entries)
- Verify API URLs are correct
- Check for CORS errors

### 2. **Check Browser Console**
- Look for JavaScript errors
- Check for CORS policy violations
- Verify API responses

### 3. **Check Environment Variables**
```bash
# In browser console
console.log(process.env.REACT_APP_API_URL)
```

### 4. **Check Backend Logs**
- Monitor server logs for incoming requests
- Check for CORS preflight failures
- Verify authentication tokens

## 📋 Common Issues & Solutions

### Issue: "Network Error" on all API calls
**Solution**: Check API URL configuration and rebuild frontend

### Issue: CORS policy blocking requests
**Solution**: Add frontend domain to backend CORS origins

### Issue: File uploads failing
**Solution**: Check both API URL and CORS configuration

### Issue: Dashboard shows loading forever
**Solution**: Check browser console for API errors

## 🚀 Deployment Checklist

### Frontend Deployment
- [ ] Environment variables set correctly in Render
- [ ] Build uses correct API URL
- [ ] No hardcoded URLs in code

### Backend Deployment
- [ ] CORS origins include all frontend URLs
- [ ] Environment variables configured
- [ ] Upload routes working

### Testing After Deployment
- [ ] Dashboard loads correctly
- [ ] All API endpoints respond
- [ ] File uploads work
- [ ] No console errors

## 📞 Support

If you encounter similar issues:

1. **Check the browser console** for specific error messages
2. **Verify environment variables** are set correctly
3. **Check CORS configuration** includes your domain
4. **Test API endpoints** directly in browser
5. **Monitor server logs** for incoming requests

---

**Result**: All API connection issues have been resolved! The dashboard should now work properly with full functionality. 🎉
