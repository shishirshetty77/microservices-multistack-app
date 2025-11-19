#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "=================================="
echo "Microservices Demo Script"
echo "=================================="
echo ""

# Wait for services to be ready
wait_for_service() {
    local service_name=$1
    local url=$2
    local max_attempts=30
    local attempt=1

    echo -n "Waiting for $service_name to be ready"
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" > /dev/null 2>&1; then
            echo -e " ${GREEN}✓${NC}"
            return 0
        fi
        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo -e " ${RED}✗${NC}"
    echo "Failed to connect to $service_name"
    return 1
}

# Check if services are running
echo "Checking service availability..."
wait_for_service "User Service" "http://localhost:8001/health"
wait_for_service "Product Service" "http://localhost:8002/health"
wait_for_service "Order Service" "http://localhost:8003/health"
wait_for_service "Notification Service" "http://localhost:8004/health"
wait_for_service "Analytics Service" "http://localhost:8005/health"

echo ""
echo "=================================="
echo "Running Demo Workflow"
echo "=================================="
echo ""

# 1. Create a user
echo -e "${YELLOW}1. Creating a user...${NC}"
USER_RESPONSE=$(curl -s -X POST http://localhost:8001/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice Smith", "email": "alice@example.com"}')
echo "$USER_RESPONSE" | jq '.'
USER_ID=$(echo "$USER_RESPONSE" | jq -r '.id')
echo -e "${GREEN}✓ User created with ID: $USER_ID${NC}"
echo ""

# 2. Create a product
echo -e "${YELLOW}2. Creating a product...${NC}"
PRODUCT_RESPONSE=$(curl -s -X POST http://localhost:8002/api/products \
  -H "Content-Type: application/json" \
  -d '{"name": "MacBook Pro", "price": 2499.99, "stock": 25}')
echo "$PRODUCT_RESPONSE" | jq '.'
PRODUCT_ID=$(echo "$PRODUCT_RESPONSE" | jq -r '.id')
echo -e "${GREEN}✓ Product created with ID: $PRODUCT_ID${NC}"
echo ""

# 3. Create an order
echo -e "${YELLOW}3. Creating an order...${NC}"
ORDER_RESPONSE=$(curl -s -X POST http://localhost:8003/api/orders \
  -H "Content-Type: application/json" \
  -d "{\"userId\": \"$USER_ID\", \"productId\": \"$PRODUCT_ID\", \"quantity\": 1}")
echo "$ORDER_RESPONSE" | jq '.'
ORDER_ID=$(echo "$ORDER_RESPONSE" | jq -r '.id')
echo -e "${GREEN}✓ Order created with ID: $ORDER_ID${NC}"
echo ""

# 4. Check notifications
echo -e "${YELLOW}4. Checking notifications for user...${NC}"
NOTIFICATIONS=$(curl -s http://localhost:8004/api/notifications/$USER_ID)
echo "$NOTIFICATIONS" | jq '.'
echo -e "${GREEN}✓ Notifications retrieved${NC}"
echo ""

# 5. Get analytics summary
echo -e "${YELLOW}5. Getting analytics summary...${NC}"
ANALYTICS=$(curl -s http://localhost:8005/api/analytics/summary)
echo "$ANALYTICS" | jq '.'
echo -e "${GREEN}✓ Analytics retrieved${NC}"
echo ""

echo "=================================="
echo -e "${GREEN}Demo completed successfully!${NC}"
echo "=================================="
echo ""
echo "You can now:"
echo "- View all users: curl http://localhost:8001/api/users"
echo "- View all products: curl http://localhost:8002/api/products"
echo "- View all orders: curl http://localhost:8003/api/orders"
echo "- View all notifications: curl http://localhost:8004/api/notifications"
echo "- View analytics: curl http://localhost:8005/api/analytics/summary"
