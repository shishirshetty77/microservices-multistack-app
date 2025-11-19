# Microservices Platform - Quick Reference

## Project Overview

This is a complete, production-ready microservices architecture demonstrating best practices across **five different programming languages**:

1. **User Service** - Go (Gorilla Mux)
2. **Product Service** - Python (Flask)
3. **Order Service** - Java (Spring Boot)
4. **Notification Service** - Node.js (Express)
5. **Analytics Service** - Rust (Actix-web)

## Quick Start (3 Commands)

```bash
# 1. Start all services
bash start.sh

# 2. Run a demo workflow
bash demo.sh

# 3. Stop all services
make down
```

## Service Ports

| Service | Port | Language | Framework |
|---------|------|----------|-----------|
| User | 8001 | Go | Gorilla Mux |
| Product | 8002 | Python | Flask |
| Order | 8003 | Java | Spring Boot |
| Notification | 8004 | Node.js | Express |
| Analytics | 8005 | Rust | Actix-web |

## Key Features Implemented

✅ **REST API** - All services expose RESTful endpoints  
✅ **Inter-service Communication** - Services call each other via HTTP  
✅ **Proper Folder Structure** - Language-specific best practices  
✅ **Structured Logging** - JSON-formatted logs with levels  
✅ **Error Handling** - Comprehensive validation and error responses  
✅ **Environment Configuration** - All config via environment variables  
✅ **Health Checks** - Every service has `/health` endpoint  
✅ **Dockerization** - Multi-stage builds for optimization  
✅ **Docker Compose** - Complete orchestration setup  
✅ **CORS Support** - Cross-origin requests enabled  
✅ **Graceful Shutdown** - Signal handling in all services  

## Project Structure

```
project/
├── README.md                    # Main documentation
├── ARCHITECTURE.md              # Detailed architecture guide
├── API_DOCS.md                  # Complete API reference
├── docker-compose.yml           # Service orchestration
├── Makefile                     # Convenient commands
├── start.sh                     # Quick start script
├── demo.sh                      # Demo workflow script
│
├── user-service/                # Go service
│   ├── cmd/main.go
│   ├── internal/
│   │   ├── config/
│   │   ├── handlers/
│   │   ├── logger/
│   │   └── models/
│   ├── Dockerfile
│   └── go.mod
│
├── product-service/             # Python service
│   ├── src/
│   │   ├── app.py
│   │   ├── config.py
│   │   ├── logger.py
│   │   ├── models.py
│   │   └── routes.py
│   ├── Dockerfile
│   └── requirements.txt
│
├── order-service/               # Java service
│   ├── src/main/java/com/example/order/
│   │   ├── OrderApplication.java
│   │   ├── controller/
│   │   ├── service/
│   │   ├── model/
│   │   └── config/
│   ├── Dockerfile
│   └── pom.xml
│
├── notification-service/        # Node.js service
│   ├── src/
│   │   ├── app.js
│   │   ├── config.js
│   │   ├── logger.js
│   │   ├── models/
│   │   └── routes.js
│   ├── Dockerfile
│   └── package.json
│
└── analytics-service/           # Rust service
    ├── src/
    │   ├── main.rs
    │   ├── config.rs
    │   ├── handlers.rs
    │   └── models.rs
    ├── Dockerfile
    └── Cargo.toml
```

## Common Commands

```bash
# Build all services
make build

# Start services (detached)
make up

# View logs (follow mode)
make logs

# Test all health endpoints
make test-services

# Show running containers
make ps

# Restart all services
make restart

# Stop all services
make down

# Complete cleanup
make clean
```

## Example API Calls

### Create a User
```bash
curl -X POST http://localhost:8001/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice", "email": "alice@example.com"}'
```

### Create a Product
```bash
curl -X POST http://localhost:8002/api/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Laptop", "price": 1299.99, "stock": 50}'
```

### Create an Order
```bash
curl -X POST http://localhost:8003/api/orders \
  -H "Content-Type: application/json" \
  -d '{"userId": "1", "productId": "1", "quantity": 2}'
```

### Get Analytics
```bash
curl http://localhost:8005/api/analytics/summary | jq
```

### Check Health
```bash
curl http://localhost:8001/health
curl http://localhost:8002/health
curl http://localhost:8003/health
curl http://localhost:8004/health
curl http://localhost:8005/health
```

## Service Communication Example

When you create an order, this happens:

1. **Client** → Order Service: `POST /api/orders`
2. **Order Service** → User Service: Validates user exists
3. **Order Service** → Product Service: Gets product price
4. **Order Service** → Notification Service: Sends confirmation
5. **Order Service** → Client: Returns order details

## Learning Outcomes

This project demonstrates:

- **Polyglot Microservices** - Different languages, same patterns
- **RESTful API Design** - Consistent endpoint structure
- **Service Discovery** - Docker DNS-based discovery
- **Inter-service Communication** - HTTP-based sync calls
- **Containerization** - Docker best practices
- **Orchestration** - Docker Compose networking
- **Configuration Management** - Environment-based config
- **Observability** - Structured logging and health checks
- **Error Handling** - Graceful degradation and validation
- **Clean Architecture** - Separation of concerns

## Next Steps for Production

1. Add persistent databases (PostgreSQL, MongoDB)
2. Implement message queue (RabbitMQ, Kafka)
3. Add API Gateway (Kong, Nginx)
4. Implement authentication/authorization (JWT, OAuth2)
5. Add service mesh (Istio, Linkerd)
6. Implement circuit breakers and retries
7. Add distributed tracing (Jaeger, Zipkin)
8. Setup monitoring (Prometheus, Grafana)
9. Implement rate limiting
10. Add comprehensive test suites

## Documentation Files

- `README.md` - Main documentation and getting started
- `ARCHITECTURE.md` - Detailed architecture and design patterns
- `API_DOCS.md` - Complete API reference for all services
- `QUICKSTART.md` - This file, quick reference guide

## Troubleshooting

**Services won't start:**
- Check if Docker is running: `docker info`
- Check if ports are available: `lsof -i :8001-8005`
- View service logs: `docker-compose logs <service-name>`

**Build failures:**
- Clean and rebuild: `make clean && make build`
- Check Docker disk space: `docker system df`
- Check individual service logs

**Inter-service communication issues:**
- Verify all services are healthy: `make test-services`
- Check Docker network: `docker network inspect project_microservices-network`
- View service logs for errors

## Support

For detailed information:
- Architecture details → See `ARCHITECTURE.md`
- API specifications → See `API_DOCS.md`
- Getting started → See `README.md`

---

**Built with ❤️ to demonstrate microservices best practices**
