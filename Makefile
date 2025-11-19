.PHONY: help build up down restart logs clean test-services

help:
	@echo "Microservices Platform - Available Commands"
	@echo "==========================================="
	@echo "make build          - Build all Docker images"
	@echo "make up             - Start all services"
	@echo "make down           - Stop all services"
	@echo "make restart        - Restart all services"
	@echo "make logs           - View logs from all services"
	@echo "make clean          - Remove all containers, images, and volumes"
	@echo "make test-services  - Test all service endpoints"
	@echo "make ps             - Show running containers"

build:
	@echo "Building all services..."
	docker-compose build

up:
	@echo "Starting all services..."
	docker-compose up -d
	@echo ""
	@echo "Services are starting up..."
	@echo "User Service:         http://localhost:8001"
	@echo "Product Service:      http://localhost:8002"
	@echo "Order Service:        http://localhost:8003"
	@echo "Notification Service: http://localhost:8004"
	@echo "Analytics Service:    http://localhost:8005"
	@echo ""
	@echo "Run 'make logs' to view service logs"

down:
	@echo "Stopping all services..."
	docker-compose down

restart:
	@echo "Restarting all services..."
	docker-compose restart

logs:
	docker-compose logs -f

clean:
	@echo "Cleaning up containers, images, and volumes..."
	docker-compose down -v --rmi all --remove-orphans
	@echo "Cleanup complete!"

ps:
	docker-compose ps

test-services:
	@echo "Testing all service health endpoints..."
	@echo ""
	@echo "User Service:"
	@curl -s http://localhost:8001/health | jq '.' || echo "Service not responding"
	@echo ""
	@echo "Product Service:"
	@curl -s http://localhost:8002/health | jq '.' || echo "Service not responding"
	@echo ""
	@echo "Order Service:"
	@curl -s http://localhost:8003/health | jq '.' || echo "Service not responding"
	@echo ""
	@echo "Notification Service:"
	@curl -s http://localhost:8004/health | jq '.' || echo "Service not responding"
	@echo ""
	@echo "Analytics Service:"
	@curl -s http://localhost:8005/health | jq '.' || echo "Service not responding"
