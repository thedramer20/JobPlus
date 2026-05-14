# JobPlus Frontend Startup Guide

## Quick Start

### Option 1: Using the Batch File (Recommended for Windows)
1. Double-click `start-frontend.bat` in the frontend directory
2. Wait for the server to start (you'll see "ready in xxx ms")
3. Open your browser and go to: http://localhost:5173

### Option 2: Using Command Line
1. Open Command Prompt or PowerShell
2. Navigate to the frontend directory:
   ```bash
   cd C:\Users\zayed\Desktop\JobPlus\frontend
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Wait for the server to start (you'll see "ready in xxx ms")
5. Open your browser and go to: http://localhost:5173

## Configuration

The frontend is now configured to:
- Run on port: 5173
- Connect to backend on port: 9090
- Auto-open in browser when started

## Environment Variables

The following environment variables are configured in `.env`:
- `VITE_API_BASE_URL=http://localhost:9090` - Backend API URL
- `VITE_API_URL=http://localhost:9090` - Alternative API URL

## Troubleshooting

### Issue: Port 5173 is already in use
**Solution:**
```bash
# Find the process using port 5173
netstat -ano | findstr :5173

# Kill the process (replace <PID> with the actual PID)
taskkill /PID <PID> /F
```

### Issue: Dependencies are missing
**Solution:**
```bash
# Navigate to frontend directory
cd C:\Users\zayed\Desktop\JobPlus\frontend

# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rmdir /s /q node_modules
del package-lock.json

# Reinstall dependencies
npm install

# Start the server
npm run dev
```

### Issue: Server starts but shows blank page
**Solution:**
1. Open browser developer tools (F12)
2. Check Console tab for errors
3. Check Network tab for failed requests
4. Ensure backend is running on port 9090

### Issue: API calls fail
**Solution:**
1. Ensure backend is running on port 9090
2. Check that `.env` file exists with correct `VITE_API_BASE_URL`
3. Verify backend is accessible: http://localhost:9090

## Important Notes

1. **Keep the terminal window open** - The development server needs to stay running
2. **Don't close the terminal** - If you close it, the server stops
3. **Backend must be running** - The frontend needs the backend on port 9090
4. **First run may take longer** - Initial compilation may take 1-2 minutes

## Expected Output

When the server starts successfully, you should see:
```
  VITE v7.3.2  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

## Support

If you encounter any issues not covered in this guide:
1. Check the terminal output for error messages
2. Check browser console (F12) for JavaScript errors
3. Ensure all dependencies are installed
4. Verify backend is running on port 9090
