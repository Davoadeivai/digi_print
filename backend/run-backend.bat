@echo off
echo ========================================
echo   Starting Django Backend Server
echo   Port: 8000
echo ========================================
echo.

REM Check if virtual environment exists
if exist venv\Scripts\activate.bat (
    echo Activating virtual environment...
    call venv\Scripts\activate.bat
) else if exist .venv\Scripts\activate.bat (
    echo Activating virtual environment...
    call .venv\Scripts\activate.bat
) else (
    echo Warning: No virtual environment found!
    echo Running with system Python...
)

echo.
echo Starting server on http://localhost:8000
echo Press Ctrl+C to stop the server
echo.

python manage.py runserver 8000
