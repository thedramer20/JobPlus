@echo off
echo ========================================
echo Committing and pushing changes to GitHub
echo ========================================
echo.

cd /d "%~dp0"

echo Step 1: Adding all changes to staging...
git add .
if %errorlevel% neq 0 (
    echo Error: Failed to add files to staging
    pause
    exit /b 1
)
echo.

echo Step 2: Committing changes...
git commit -m "Fix Link import error and improve error handling with better UI"
if %errorlevel% neq 0 (
    echo Error: Failed to commit changes
    pause
    exit /b 1
)
echo.

echo Step 3: Pushing changes to GitHub...
git push
if %errorlevel% neq 0 (
    echo Error: Failed to push changes
    pause
    exit /b 1
)
echo.

echo ========================================
echo Success! Changes have been pushed to GitHub
echo ========================================
pause
