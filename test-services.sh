#!/bin/bash

echo "🧪 Testing Microservices API Endpoints..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test User Service
echo -e "${YELLOW}Testing User Service...${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8001/api/users)
if [ "$response" -eq 200 ]; then
    echo -e "${GREEN}✅ User Service: OK${NC}"
else
    echo -e "${RED}❌ User Service: Failed (HTTP $response)${NC}"
fi

# Test Product Service
echo -e "${YELLOW}Testing Product Service...${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8002/api/products)
if [ "$response" -eq 200 ]; then
    echo -e "${GREEN}✅ Product Service: OK${NC}"
else
    echo -e "${RED}❌ Product Service: Failed (HTTP $response)${NC}"
fi

# Test Order Service
echo -e "${YELLOW}Testing Order Service...${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8003/api/orders)
if [ "$response" -eq 200 ]; then
    echo -e "${GREEN}✅ Order Service: OK${NC}"
else
    echo -e "${RED}❌ Order Service: Failed (HTTP $response)${NC}"
fi

# Test Notification Service
echo -e "${YELLOW}Testing Notification Service...${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8004/api/notifications)
if [ "$response" -eq 200 ]; then
    echo -e "${GREEN}✅ Notification Service: OK${NC}"
else
    echo -e "${RED}❌ Notification Service: Failed (HTTP $response)${NC}"
fi

# Test Analytics Service
echo -e "${YELLOW}Testing Analytics Service...${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8005/api/analytics/summary)
if [ "$response" -eq 200 ]; then
    echo -e "${GREEN}✅ Analytics Service: OK${NC}"
else
    echo -e "${RED}❌ Analytics Service: Failed (HTTP $response)${NC}"
fi

# Test Frontend
echo -e "${YELLOW}Testing Frontend...${NC}"
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ "$response" -eq 200 ]; then
    echo -e "${GREEN}✅ Frontend: OK${NC}"
else
    echo -e "${RED}❌ Frontend: Failed (HTTP $response)${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Testing Complete!${NC}"
echo ""
echo "Access the application at: http://localhost:3000"
