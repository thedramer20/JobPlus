@echo off
cd /d "%~dp0"
git add .
git commit -m "Fix Link import error and improve error handling with better UI"
git push
pause
