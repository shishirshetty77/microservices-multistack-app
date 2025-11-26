# Microservices Multistack App

A modern, polyglot microservices application demonstrating a multi-language architecture with a premium React frontend.

## 🚀 Features

- **Polyglot Architecture**: Services written in Go, Python, Java, Node.js, and Rust.
- **Modern Frontend**: React-based UI with a premium Dark Mode aesthetic, Glassmorphism, and real-time updates.
- **Database Isolation**: Each microservice owns its own PostgreSQL database (`user_db`, `product_db`, etc.).
- **Event-Driven**: Asynchronous communication for notifications and analytics.
- **Production Ready**: Kubernetes manifests and Helm charts included.

## 🏗️ Architecture

The system consists of 5 microservices and a frontend:

| Service                  | Language | Port | Database          | Description                               |
| :----------------------- | :------- | :--- | :---------------- | :---------------------------------------- |
| **User Service**         | Go       | 8001 | `user_db`         | Manages user accounts and authentication. |
| **Product Service**      | Python   | 8002 | `product_db`      | Handles product catalog and inventory.    |
| **Order Service**        | Java     | 8003 | `order_db`        | Orchestrates orders across services.      |
| **Notification Service** | Node.js  | 8004 | `notification_db` | Sends alerts and notifications.           |
| **Analytics Service**    | Rust     | 8005 | `analytics_db`    | Aggregates metrics from all services.     |
| **Frontend**             | React    | 3000 | -                 | User interface for the application.       |

### Communication Flow

1.  **Order Flow (Synchronous)**:

    - User creates an order via Frontend.
    - **Order Service** verifies user with **User Service**.
    - **Order Service** checks stock with **Product Service**.
    - **Order Service** creates the order.
    - **Order Service** triggers a notification via **Notification Service**.

2.  **Analytics Flow (Asynchronous)**:
    - **Analytics Service** periodically polls all other services to aggregate data.

## 🛠️ Setup & Deployment

### Prerequisites

- Docker & Docker Compose
- Kubernetes Cluster (Optional)
- Helm (Optional)

### Local Development (Docker Compose)

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/shishirshetty77/microservices-multistack-app.git
    cd microservices-multistack-app
    ```

2.  **Start the application**:

    ```bash
    docker compose up --build
    ```

3.  **Access the application**:
    - Frontend: `http://localhost:3000`
    - API Gateway (Nginx): `http://localhost:80`

### Kubernetes Deployment (Helm)

1.  **Install the Helm chart**:

    ```bash
    helm install microservices-app ./charts/microservices-app
    ```

2.  **Verify pods**:
    ```bash
    kubectl get pods
    ```

## 📂 Project Structure

```
.
├── charts/                 # Helm charts
├── db-init/                # Database initialization scripts
├── frontend/               # React frontend source
├── k8s/                    # Kubernetes manifests
├── analytics-service/      # Rust service
├── notification-service/   # Node.js service
├── order-service/          # Java service
├── product-service/        # Python service
├── user-service/           # Go service
└── docker-compose.yml      # Local development config
```

## 📝 API Documentation

### User Service

- `GET /api/users`: List all users
- `POST /api/users`: Create a user

### Product Service

- `GET /api/products`: List all products
- `POST /api/products`: Create a product

### Order Service

- `GET /api/orders`: List all orders
- `POST /api/orders`: Create an order

### Notification Service

- `GET /api/notifications`: List notifications

### Analytics Service

- `GET /api/analytics`: Get system stats
