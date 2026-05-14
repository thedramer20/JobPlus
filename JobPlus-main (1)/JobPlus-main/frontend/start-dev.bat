@echo off
setlocal
cd /d "%~dp0"

echo ==========================================
echo JobPlus Frontend Startup
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:9090
echo ==========================================

echo Cleaning port 5173...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173 ^| findstr LISTENING') do (
    echo Killing PID %%a using port 5173...
    taskkill /f /pid %%a
)

echo Setting backend API URL...
set VITE_API_BASE_URL=http://localhost:9090

echo Checking dependencies...
if not exist "node_modules\" (
    echo node_modules missing. Running npm install...
    call npm install
    if errorlevel 1 (
        echo npm install failed. Fix the error above.
        pause
        exit /b 1
    )
)

echo Starting Vite in foreground...
echo Do not close this window.
call npm run dev -- --host 127.0.0.1 --port 5173

echo Vite stopped or failed. Check the error above.
pause
