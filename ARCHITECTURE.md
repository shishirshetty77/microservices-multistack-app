# Microservices Architecture Details

## System Architecture

### High-Level Overview

The system consists of five independent microservices that communicate via HTTP REST APIs. Each service is containerized and can be deployed independently.

```
                                    ┌──────────────────┐
                                    │   API Gateway    │
                                    │   (Future)       │
                                    └────────┬─────────┘
                                             │
                    ┌────────────────────────┼────────────────────────┐
                    │                        │                        │
         ┌──────────▼──────────┐  ┌─────────▼────────┐  ┌───────────▼────────┐
         │   User Service      │  │ Product Service  │  │  Order Service     │
         │   (Go:8001)         │  │  (Python:8002)   │  │   (Java:8003)      │
         └─────────────────────┘  └──────────────────┘  └──────────┬─────────┘
                                                                    │
                                  ┌──────────────────────┬──────────┴─────────┐
                                  │                      │                    │
                       ┌──────────▼──────────┐  ┌────────▼─────────┐  ┌──────▼────────┐
                       │ Notification Service│  │ Analytics Service│  │ External APIs │
                       │   (Node.js:8004)    │  │  (Rust:8005)     │  │   (Future)    │
                       └─────────────────────┘  └──────────────────┘  └───────────────┘
```

## Service Communication Patterns

### Synchronous Communication (HTTP/REST)

All inter-service communication uses synchronous HTTP REST calls:

1. **Order → User Service**: Validate user exists before creating order
2. **Order → Product Service**: Validate product exists and get pricing
3. **Order → Notification Service**: Send order confirmation
4. **Analytics → All Services**: Aggregate metrics from all services

### Communication Flow Example: Creating an Order

```
Client                Order Service       User Service      Product Service    Notification Service
  │                         │                   │                  │                    │
  ├──POST /orders──────────>│                   │                  │                    │
  │                         │                   │                  │                    │
  │                         ├──GET /users/:id──>│                  │                    │
  │                         │<────200 OK────────┤                  │                    │
  │                         │                   │                  │                    │
  │                         ├──GET /products/:id────────────────>  │                    │
  │                         │<────200 OK + Price───────────────────┤                    │
  │                         │                   │                  │                    │
  │                         ├──POST /notifications/send─────────────────────────────>   │
  │                         │                   │                  │                    │
  │<────201 Created─────────┤                   │                  │                    │
  │                         │                   │                  │                    │
```

## Service Details

### 1. User Service (Go)

**Technology Stack:**
- Language: Go 1.21
- Framework: Gorilla Mux
- Features: Concurrency-safe in-memory storage with mutex locks

**Design Patterns:**
- Handler pattern for HTTP endpoints
- Middleware pattern for logging and CORS
- Configuration via environment variables
- Structured JSON logging

**Key Files:**
```
user-service/
├── cmd/main.go                 # Application entry point
├── internal/
│   ├── config/config.go        # Configuration management
│   ├── handlers/               # HTTP request handlers
│   ├── logger/logger.go        # Structured logging
│   └── models/user.go          # User data model
└── Dockerfile                  # Multi-stage build
```

### 2. Product Service (Python)

**Technology Stack:**
- Language: Python 3.11
- Framework: Flask
- WSGI Server: Gunicorn
- Features: Type hints, structured logging

**Design Patterns:**
- Blueprint pattern for routes
- Factory pattern for app creation
- Validation pattern in models
- JSON logging with custom formatter

**Key Files:**
```
product-service/
├── src/
│   ├── app.py                  # Application entry point
│   ├── config.py               # Configuration
│   ├── logger.py               # JSON logging
│   ├── models.py               # Product model
│   └── routes.py               # API routes
├── requirements.txt            # Dependencies
└── Dockerfile                  # Production build with Gunicorn
```

### 3. Order Service (Java)

**Technology Stack:**
- Language: Java 17
- Framework: Spring Boot 3.2
- Build Tool: Maven
- Features: Dependency injection, actuator for monitoring

**Design Patterns:**
- MVC pattern (Model-View-Controller)
- Service layer pattern
- Configuration injection
- RestTemplate for HTTP client

**Key Files:**
```
order-service/
├── src/main/java/com/example/order/
│   ├── OrderApplication.java       # Spring Boot application
│   ├── controller/                 # REST controllers
│   ├── service/OrderService.java   # Business logic
│   ├── model/Order.java            # Order entity
│   └── config/AppConfig.java       # Configuration
├── src/main/resources/
│   └── application.properties      # Spring configuration
├── pom.xml                         # Maven dependencies
└── Dockerfile                      # Multi-stage Maven build
```

### 4. Notification Service (Node.js)

**Technology Stack:**
- Runtime: Node.js 18
- Framework: Express.js
- Logging: Winston
- Features: Async/await, graceful shutdown

**Design Patterns:**
- Router pattern for endpoints
- Model pattern for data
- Middleware pattern for logging
- Error handling middleware

**Key Files:**
```
notification-service/
├── src/
│   ├── app.js                  # Express application
│   ├── config.js               # Configuration
│   ├── logger.js               # Winston logging
│   ├── models/Notification.js  # Notification model
│   └── routes.js               # API routes
├── package.json                # NPM dependencies
└── Dockerfile                  # Production Node build
```

### 5. Analytics Service (Rust)

**Technology Stack:**
- Language: Rust 1.75
- Framework: Actix-web
- Features: Memory safety, zero-cost abstractions, async runtime

**Design Patterns:**
- Actor pattern (via Actix)
- Handler functions pattern
- Configuration module
- Type-safe HTTP client (reqwest)

**Key Files:**
```
analytics-service/
├── src/
│   ├── main.rs                 # Application entry point
│   ├── config.rs               # Configuration module
│   ├── handlers.rs             # Request handlers
│   └── models.rs               # Data models
├── Cargo.toml                  # Rust dependencies
└── Dockerfile                  # Multi-stage Rust build
```

## Best Practices Implemented

### 1. Configuration Management
- Environment variables for all configuration
- Sensible defaults for local development
- `.env.example` files for documentation
- No hardcoded values

### 2. Logging
- Structured JSON logging across all services
- Consistent log format with timestamp, level, message
- Request/response logging middleware
- Error logging with stack traces

### 3. Error Handling
- Comprehensive input validation
- Consistent error response format
- Appropriate HTTP status codes
- Graceful degradation (notifications don't fail orders)

### 4. Health Checks
- `/health` endpoint on every service
- Docker health checks configured
- Returns service status and timestamp
- Used for orchestration and monitoring

### 5. Containerization
- Multi-stage Docker builds for smaller images
- Non-root users where applicable
- Minimal base images (Alpine Linux)
- Layer caching optimization

### 6. Service Independence
- Each service has its own data store (in-memory)
- Services can be deployed independently
- Loose coupling via HTTP APIs
- No shared databases

### 7. API Design
- RESTful conventions
- Versioned API paths (`/api/...`)
- Consistent response formats
- CORS enabled for cross-origin requests

## Deployment Architecture

### Docker Compose Setup

All services run in containers connected via a bridge network:

```
microservices-network (bridge)
    ├── user-service:8001
    ├── product-service:8002
    ├── order-service:8003
    ├── notification-service:8004
    └── analytics-service:8005
```

**Service Dependencies:**
- Product Service depends on User Service
- Order Service depends on User, Product, and Notification services
- Analytics Service depends on all other services

**Resource Allocation:**
- Each service runs in isolated container
- Services discover each other via Docker DNS
- Port mapping for external access
- Health checks for availability monitoring

## Scalability Considerations

### Current Implementation
- In-memory storage (ephemeral)
- Single instance per service
- Synchronous communication only

### Production Recommendations

1. **Data Persistence:**
   - Replace in-memory stores with databases
   - User Service: PostgreSQL
   - Product Service: PostgreSQL or MongoDB
   - Order Service: PostgreSQL with transactions
   - Notification Service: Redis or MongoDB
   - Analytics Service: TimescaleDB or Elasticsearch

2. **Asynchronous Communication:**
   - Add message queue (RabbitMQ, Kafka)
   - Decouple order creation from notifications
   - Event-driven architecture for analytics

3. **Service Discovery:**
   - Implement Consul or Eureka
   - Dynamic service registration
   - Load balancing

4. **API Gateway:**
   - Add Kong, Nginx, or custom gateway
   - Centralized authentication
   - Rate limiting and caching

5. **Observability:**
   - Distributed tracing (Jaeger, Zipkin)
   - Metrics aggregation (Prometheus)
   - Centralized logging (ELK stack)

6. **Resilience:**
   - Circuit breakers (Hystrix pattern)
   - Retry logic with exponential backoff
   - Timeouts and bulkheads
   - Fallback mechanisms

## Security Considerations

### Current Implementation
- No authentication/authorization
- Services trust each other
- Open CORS policy

### Production Recommendations

1. **Authentication & Authorization:**
   - JWT tokens for API authentication
   - OAuth2 for user authentication
   - Service-to-service authentication
   - Role-based access control (RBAC)

2. **Network Security:**
   - Internal service mesh (Istio, Linkerd)
   - mTLS for inter-service communication
   - Network policies and firewall rules
   - VPC/subnet isolation

3. **Data Security:**
   - Encrypt sensitive data at rest
   - TLS for all external communication
   - Secret management (Vault, AWS Secrets Manager)
   - Input sanitization and validation

## Testing Strategy

### Unit Tests
- Test individual functions and methods
- Mock external dependencies
- High code coverage target (>80%)

### Integration Tests
- Test service interactions
- Use test containers
- Verify API contracts

### End-to-End Tests
- Test complete workflows
- Use the demo script as basis
- Verify system behavior

## Monitoring & Observability

### Metrics to Track
- Request rate and latency
- Error rates and types
- Resource utilization (CPU, memory)
- Service dependencies health
- Business metrics (orders, users, etc.)

### Alerts
- Service down/unhealthy
- High error rates
- Response time degradation
- Resource exhaustion

---

This architecture provides a solid foundation for learning microservices patterns while being simple enough to understand and extend.
