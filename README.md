# Microservices E-Commerce Platform

A production-ready microservices architecture demonstrating best practices across five different programming languages: **Go**, **Python**, **Java**, **Node.js**, and **Rust**.

## 🏗️ Architecture Overview

This system implements a simplified e-commerce platform with the following services:

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
       ├──────────────┬──────────────┬──────────────┬──────────────┐
       │              │              │              │              │
       ▼              ▼              ▼              ▼              ▼
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│   User   │   │ Product  │   │  Order   │   │Notification│ │Analytics │
│ Service  │   │ Service  │   │ Service  │   │  Service   │ │ Service  │
│   (Go)   │   │ (Python) │   │  (Java)  │   │  (Node.js) │ │  (Rust)  │
└──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘
     │              │              │                │              │
     └──────────────┴──────────────┴────────────────┴──────────────┘
                            Service Communication
```

## 📦 Services

### 1. User Service (Go)
- **Port**: 8001
- **Purpose**: User authentication and profile management
- **Tech Stack**: Go, Gorilla Mux
- **Endpoints**:
  - `POST /api/users` - Create new user
  - `GET /api/users/:id` - Get user by ID
  - `GET /api/users` - List all users
  - `PUT /api/users/:id` - Update user
  - `DELETE /api/users/:id` - Delete user
  - `GET /health` - Health check

### 2. Product Service (Python)
- **Port**: 8002
- **Purpose**: Product catalog management
- **Tech Stack**: Python, Flask
- **Endpoints**:
  - `POST /api/products` - Create product
  - `GET /api/products/:id` - Get product by ID
  - `GET /api/products` - List all products
  - `PUT /api/products/:id` - Update product
  - `DELETE /api/products/:id` - Delete product
  - `GET /health` - Health check

### 3. Order Service (Java)
- **Port**: 8003
- **Purpose**: Order processing and management
- **Tech Stack**: Java, Spring Boot
- **Dependencies**: Calls User Service and Product Service
- **Endpoints**:
  - `POST /api/orders` - Create order (validates user & product)
  - `GET /api/orders/:id` - Get order by ID
  - `GET /api/orders/user/:userId` - Get orders by user
  - `GET /api/orders` - List all orders
  - `GET /health` - Health check

### 4. Notification Service (Node.js)
- **Port**: 8004
- **Purpose**: Send notifications for various events
- **Tech Stack**: Node.js, Express
- **Endpoints**:
  - `POST /api/notifications/send` - Send notification
  - `GET /api/notifications/:userId` - Get user notifications
  - `GET /api/notifications` - List all notifications
  - `GET /health` - Health check

### 5. Analytics Service (Rust)
- **Port**: 8005
- **Purpose**: Aggregate and analyze system metrics
- **Tech Stack**: Rust, Actix-web
- **Dependencies**: Calls all other services for metrics
- **Endpoints**:
  - `GET /api/analytics/summary` - Get system summary
  - `GET /api/analytics/users` - User statistics
  - `GET /api/analytics/products` - Product statistics
  - `GET /api/analytics/orders` - Order statistics
  - `GET /health` - Health check

## 🔄 Service Communication Flow

**Example: Creating an Order**
1. Client → Order Service: `POST /api/orders`
2. Order Service → User Service: Validates user exists
3. Order Service → Product Service: Validates product exists and stock
4. Order Service → Notification Service: Sends order confirmation
5. Order Service → Client: Returns order details

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose
- Or individual runtimes: Go 1.21+, Python 3.11+, Java 17+, Node.js 18+, Rust 1.70+

### Quick Start with Docker Compose

```bash
# Build all services
docker-compose build

# Start all services
docker-compose up

# Start in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Using Makefile

```bash
# Build all services
make build

# Run all services
make up

# Stop all services
make down

# View logs
make logs

# Restart all services
make restart

# Clean up
make clean
```

### Individual Service Development

#### User Service (Go)
```bash
cd user-service
go mod download
go run cmd/main.go
```

#### Product Service (Python)
```bash
cd product-service
pip install -r requirements.txt
python src/app.py
```

#### Order Service (Java)
```bash
cd order-service
./mvnw spring-boot:run
```

#### Notification Service (Node.js)
```bash
cd notification-service
npm install
npm start
```

#### Analytics Service (Rust)
```bash
cd analytics-service
cargo build --release
cargo run
```

## 🧪 Testing the Services

### Create a User
```bash
curl -X POST http://localhost:8001/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'
```

### Create a Product
```bash
curl -X POST http://localhost:8002/api/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Laptop", "price": 999.99, "stock": 50}'
```

### Create an Order
```bash
curl -X POST http://localhost:8003/api/orders \
  -H "Content-Type: application/json" \
  -d '{"userId": "1", "productId": "1", "quantity": 2}'
```

### Get Analytics Summary
```bash
curl http://localhost:8005/api/analytics/summary
```

### Check Health of All Services
```bash
curl http://localhost:8001/health
curl http://localhost:8002/health
curl http://localhost:8003/health
curl http://localhost:8004/health
curl http://localhost:8005/health
```

## 📁 Project Structure

```
microservices-platform/
├── user-service/           # Go service
│   ├── cmd/
│   │   └── main.go
│   ├── internal/
│   │   ├── handlers/
│   │   ├── models/
│   │   └── config/
│   ├── Dockerfile
│   └── go.mod
├── product-service/        # Python service
│   ├── src/
│   │   ├── app.py
│   │   ├── models.py
│   │   ├── routes.py
│   │   └── config.py
│   ├── Dockerfile
│   └── requirements.txt
├── order-service/          # Java service
│   ├── src/main/java/com/example/order/
│   │   ├── OrderApplication.java
│   │   ├── controller/
│   │   ├── service/
│   │   ├── model/
│   │   └── config/
│   ├── Dockerfile
│   └── pom.xml
├── notification-service/   # Node.js service
│   ├── src/
│   │   ├── app.js
│   │   ├── routes/
│   │   ├── models/
│   │   └── config/
│   ├── Dockerfile
│   └── package.json
├── analytics-service/      # Rust service
│   ├── src/
│   │   ├── main.rs
│   │   ├── handlers/
│   │   ├── models/
│   │   └── config/
│   ├── Dockerfile
│   └── Cargo.toml
├── docker-compose.yml
├── Makefile
└── README.md
```

## 🔧 Configuration

Each service uses environment variables for configuration:

- `PORT` - Service port
- `SERVICE_NAME` - Service identifier
- `LOG_LEVEL` - Logging level (debug, info, warn, error)
- Service-specific URLs for inter-service communication

## 📊 Best Practices Implemented

✅ **Proper Folder Structure** - Each service follows language-specific conventions  
✅ **Environment-based Configuration** - All services use env variables  
✅ **Structured Logging** - JSON-formatted logs with levels  
✅ **Error Handling** - Comprehensive error handling and validation  
✅ **Health Checks** - All services expose `/health` endpoint  
✅ **Dockerization** - Multi-stage builds for optimization  
✅ **API Versioning** - All endpoints prefixed with `/api`  
✅ **CORS Support** - Cross-origin requests enabled  
✅ **Graceful Shutdown** - Proper signal handling  
✅ **Service Discovery** - Via Docker networking  

## 🛠️ Technology Stack

| Service | Language | Framework | Port |
|---------|----------|-----------|------|
| User | Go 1.21 | Gorilla Mux | 8001 |
| Product | Python 3.11 | Flask | 8002 |
| Order | Java 17 | Spring Boot | 8003 |
| Notification | Node.js 18 | Express | 8004 |
| Analytics | Rust 1.70 | Actix-web | 8005 |

## 📝 License

MIT License - feel free to use this for learning and projects!

## 🤝 Contributing

This is a learning project showcasing microservices patterns. Feel free to fork and extend!
