#!/bin/bash

# Quick start script for microservices platform

set -e

echo "🚀 Microservices Platform Quick Start"
echo "======================================"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Error: docker-compose is not installed. Please install it and try again."
    exit 1
fi

echo "✓ Docker is running"
echo ""

# Build services
echo "📦 Building all services..."
docker-compose build

echo ""
echo "✅ Build complete!"
echo ""

# Start services
echo "🔧 Starting all services..."
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

echo ""
echo "=================================="
echo "✅ All services are starting!"
echo "=================================="
echo ""
echo "Service URLs:"
echo "  User Service:         http://localhost:8001"
echo "  Product Service:      http://localhost:8002"
echo "  Order Service:        http://localhost:8003"
echo "  Notification Service: http://localhost:8004"
echo "  Analytics Service:    http://localhost:8005"
echo ""
echo "Health Check Endpoints:"
echo "  curl http://localhost:8001/health"
echo "  curl http://localhost:8002/health"
echo "  curl http://localhost:8003/health"
echo "  curl http://localhost:8004/health"
echo "  curl http://localhost:8005/health"
echo ""
echo "View logs:"
echo "  make logs"
echo "  docker-compose logs -f"
echo ""
echo "Run demo:"
echo "  bash demo.sh"
echo ""
echo "Stop services:"
echo "  make down"
echo "  docker-compose down"
echo ""
