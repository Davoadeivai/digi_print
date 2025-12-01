#!/bin/bash

echo "========================================"
echo "  Starting Django Backend Server"
echo "  Port: 8000"
echo "========================================"
echo ""

# Check if virtual environment exists
if [ -d "venv" ]; then
    echo "Activating virtual environment..."
    source venv/bin/activate
elif [ -d ".venv" ]; then
    echo "Activating virtual environment..."
    source .venv/bin/activate
else
    echo "Warning: No virtual environment found!"
    echo "Running with system Python..."
fi

echo ""
echo "Starting server on http://localhost:8000"
echo "Press Ctrl+C to stop the server"
echo ""

python manage.py runserver 8000
