#!/bin/bash

set -e

echo "=== EcoSphere Setup ==="
echo ""

# Check Docker
if command -v docker &> /dev/null; then
    echo "✓ Docker found"
    echo "Starting PostgreSQL..."
    docker compose up -d
    sleep 3
else
    echo "✗ Docker not found. Please install Docker or create the ecosphere database manually."
    exit 1
fi

# Backend
echo ""
echo "Setting up backend..."
cd backend
cp .env.example .env
if [ ! -d "venv" ]; then
    python -m venv venv
fi
source venv/bin/activate || . venv/Scripts/activate 2>/dev/null || true
pip install -r requirements.txt
echo "Running Alembic migrations..."
alembic upgrade head
cd ..
echo "✓ Backend ready"

# Frontend
echo ""
echo "Setting up frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
fi
cd ..
echo "✓ Frontend ready"

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Next steps:"
echo "  1. Backend: cd backend && source venv/bin/activate && uvicorn app.main:app --reload"
echo "  2. Frontend: cd frontend && npm run dev"
echo ""
echo "API docs: http://localhost:8000/docs"
echo "Frontend:  http://localhost:5173"
