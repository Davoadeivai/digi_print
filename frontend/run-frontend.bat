@echo off
echo ========================================
echo   Starting React Frontend Server
echo   Port: 5173
echo ========================================
echo.

echo Installing dependencies if needed...
call npm install

echo.
echo Starting development server on http://localhost:5173
echo Press Ctrl+C to stop the server
echo.

npm run dev
