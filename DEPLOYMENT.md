# Microservices Multi-Stack Application

A comprehensive microservices architecture demonstrating polyglot programming with multiple languages and technologies.

## Architecture Overview

This application showcases a modern microservices architecture with services written in different programming languages, each chosen for their specific strengths:

- **User Service** (Go): High-performance user management
- **Product Service** (Python): Flexible product catalog
- **Order Service** (Java): Robust order processing and orchestration
- **Notification Service** (Node.js): Real-time notifications
- **Analytics Service** (Rust): High-performance data aggregation
- **Frontend** (React): Modern single-page application

## Technology Stack

### Backend Services
- Go 1.21 with Gorilla Mux
- Python 3.11 with Flask
- Java 17 with Spring Boot
- Node.js 20 with Express
- Rust 1.70 with Actix-web

### Infrastructure
- PostgreSQL 15 for persistent data storage
- Nginx as reverse proxy
- Docker & Docker Compose for containerization

### Frontend
- React 18 with Vite
- React Router for navigation
- Recharts for data visualization
- Axios for API communication

## Quick Start

### Prerequisites
- Docker and Docker Compose
- 8GB RAM minimum
- Ports 3000, 5432, 8001-8005 available

### Running the Application

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Accessing the Application

- Frontend: http://localhost:3000
- User Service API: http://localhost:8001
- Product Service API: http://localhost:8002
- Order Service API: http://localhost:8003
- Notification Service API: http://localhost:8004
- Analytics Service API: http://localhost:8005
- PostgreSQL: localhost:5432

## Features

### Data Persistence
- PostgreSQL database with schema versioning
- Persistent volumes for data durability
- Automated database initialization
- Sample data seeding

### Service Communication
- RESTful APIs across all services
- Service-to-service HTTP communication
- Centralized routing through Nginx
- Health check endpoints for monitoring

### Frontend Features
- Responsive single-page application
- Real-time service health monitoring
- Interactive data visualization
- Complete CRUD operations for all entities
- Service topology visualization

## Development

### Building Individual Services

```bash
# User Service
cd user-service && go build ./cmd/main.go

# Product Service
cd product-service && pip install -r requirements.txt

# Order Service
cd order-service && mvn clean package

# Notification Service
cd notification-service && npm install

# Analytics Service
cd analytics-service && cargo build --release

# Frontend
cd frontend && npm install && npm run build
```

### Testing

```bash
# Run health checks for all services
./test-services.sh

# Run comprehensive test suite
./comprehensive_test.sh
```

## API Documentation

Detailed API documentation is available in `API_DOCS.md`.

## Architecture Documentation

For detailed architecture diagrams and design decisions, see `ARCHITECTURE.md`.

## Database Schema

The PostgreSQL database schema includes:
- Users table with authentication fields
- Products table with inventory tracking
- Orders table with user and product references
- Notifications table for message storage

Schema details available in `init-db.sql`.

## Service Responsibilities

### User Service
- User registration and authentication
- Profile management
- User data CRUD operations

### Product Service
- Product catalog management
- Inventory tracking
- Price management

### Order Service
- Order creation and processing
- Service orchestration (calls User, Product, Notification)
- Order history and status tracking

### Notification Service
- Notification creation and delivery
- Message persistence
- User notification history

### Analytics Service
- Cross-service data aggregation
- Real-time metrics calculation
- System-wide statistics

## Monitoring and Health Checks

All services implement health check endpoints:
- `/health` - Service health status
- Returns service name, status, and timestamp

## Contributing

This is a demonstration project showcasing microservices architecture patterns and polyglot programming.

## License

MIT License - see LICENSE file for details
