# API Documentation

Complete API reference for all microservices in the platform.

---

## User Service (Port 8001)

### Create User
```http
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Response (201 Created):**
```json
{
  "id": "1",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2024-01-01T12:00:00Z",
  "updatedAt": "2024-01-01T12:00:00Z"
}
```

### Get User by ID
```http
GET /api/users/{id}
```

### Get All Users
```http
GET /api/users
```

### Update User
```http
PUT /api/users/{id}
Content-Type: application/json

{
  "name": "John Smith",
  "email": "john.smith@example.com"
}
```

### Delete User
```http
DELETE /api/users/{id}
```

### Health Check
```http
GET /health
```

---

## Product Service (Port 8002)

### Create Product
```http
POST /api/products
Content-Type: application/json

{
  "name": "Laptop",
  "price": 999.99,
  "stock": 50
}
```

**Response (201 Created):**
```json
{
  "id": "1",
  "name": "Laptop",
  "price": 999.99,
  "stock": 50,
  "createdAt": "2024-01-01T12:00:00Z",
  "updatedAt": "2024-01-01T12:00:00Z"
}
```

### Get Product by ID
```http
GET /api/products/{id}
```

### Get All Products
```http
GET /api/products
```

### Update Product
```http
PUT /api/products/{id}
Content-Type: application/json

{
  "name": "Gaming Laptop",
  "price": 1299.99,
  "stock": 30
}
```

### Delete Product
```http
DELETE /api/products/{id}
```

### Health Check
```http
GET /health
```

---

## Order Service (Port 8003)

### Create Order
```http
POST /api/orders
Content-Type: application/json

{
  "userId": "1",
  "productId": "1",
  "quantity": 2
}
```

**Response (201 Created):**
```json
{
  "id": "1",
  "userId": "1",
  "productId": "1",
  "quantity": 2,
  "totalPrice": 1999.98,
  "status": "confirmed",
  "createdAt": "2024-01-01T12:00:00Z",
  "updatedAt": "2024-01-01T12:00:00Z"
}
```

**Notes:**
- Validates that the user exists (calls User Service)
- Validates that the product exists (calls Product Service)
- Calculates total price based on product price
- Sends order confirmation notification (calls Notification Service)

### Get Order by ID
```http
GET /api/orders/{id}
```

### Get All Orders
```http
GET /api/orders
```

### Get Orders by User
```http
GET /api/orders/user/{userId}
```

### Health Check
```http
GET /health
```

---

## Notification Service (Port 8004)

### Send Notification
```http
POST /api/notifications/send
Content-Type: application/json

{
  "userId": "1",
  "message": "Your order has been confirmed",
  "type": "order_confirmation"
}
```

**Response (201 Created):**
```json
{
  "id": "1",
  "userId": "1",
  "message": "Your order has been confirmed",
  "type": "order_confirmation",
  "read": false,
  "createdAt": "2024-01-01T12:00:00Z"
}
```

### Get Notifications for User
```http
GET /api/notifications/{userId}
```

### Get All Notifications
```http
GET /api/notifications
```

### Mark as Read
```http
PATCH /api/notifications/{id}/read
```

### Delete Notification
```http
DELETE /api/notifications/{id}
```

### Health Check
```http
GET /health
```

---

## Analytics Service (Port 8005)

### Get System Summary
```http
GET /api/analytics/summary
```

**Response (200 OK):**
```json
{
  "total_users": 10,
  "total_products": 25,
  "total_orders": 5,
  "total_notifications": 8,
  "timestamp": "2024-01-01T12:00:00Z"
}
```

**Notes:**
- Aggregates data from all other services
- Calls User, Product, Order, and Notification services

### Get User Statistics
```http
GET /api/analytics/users
```

**Response:**
```json
{
  "total": 10,
  "timestamp": "2024-01-01T12:00:00Z"
}
```

### Get Product Statistics
```http
GET /api/analytics/products
```

### Get Order Statistics
```http
GET /api/analytics/orders
```

### Health Check
```http
GET /health
```

---

## Example Workflows

### Complete Order Flow

1. **Create a user:**
```bash
curl -X POST http://localhost:8001/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice", "email": "alice@example.com"}'
```

2. **Create a product:**
```bash
curl -X POST http://localhost:8002/api/products \
  -H "Content-Type: application/json" \
  -d '{"name": "iPhone", "price": 999.99, "stock": 100}'
```

3. **Create an order:**
```bash
curl -X POST http://localhost:8003/api/orders \
  -H "Content-Type: application/json" \
  -d '{"userId": "1", "productId": "1", "quantity": 1}'
```

4. **Check notifications:**
```bash
curl http://localhost:8004/api/notifications/1
```

5. **View analytics:**
```bash
curl http://localhost:8005/api/analytics/summary
```

---

## Error Responses

All services return consistent error responses:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Testing All Services

Use the provided `demo.sh` script to test the complete workflow:

```bash
bash demo.sh
```

Or test individual health checks:

```bash
make test-services
```
