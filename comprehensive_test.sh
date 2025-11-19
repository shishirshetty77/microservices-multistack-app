#!/bin/bash

# ==========================================
# MICROSERVICES COMPREHENSIVE TEST SUITE
# ==========================================
# Tests all edge cases, error handling, and inter-service communication
# Author: AI Assistant
# Date: 2025-11-19

echo "=========================================="
echo "MICROSERVICES COMPREHENSIVE TEST SUITE"
echo "=========================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

test_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ PASS${NC}: $2"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC}: $2"
        ((FAILED++))
    fi
    echo ""
}

echo "=========================================="
echo "PHASE 1: HEALTH CHECKS"
echo "=========================================="
echo ""

echo "Test 1.1: User Service Health Check"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" http://localhost:8001/health)
echo "$RESPONSE"
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
[ "$HTTP_CODE" = "200" ] && test_result 0 "User service health endpoint" || test_result 1 "User service health endpoint (Expected 200, got $HTTP_CODE)"

echo "Test 1.2: Product Service Health Check"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" http://localhost:8002/health)
echo "$RESPONSE"
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
[ "$HTTP_CODE" = "200" ] && test_result 0 "Product service health endpoint" || test_result 1 "Product service health endpoint (Expected 200, got $HTTP_CODE)"

echo "Test 1.3: Order Service Health Check"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" http://localhost:8003/health)
echo "$RESPONSE"
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
[ "$HTTP_CODE" = "200" ] && test_result 0 "Order service health endpoint" || test_result 1 "Order service health endpoint (Expected 200, got $HTTP_CODE)"

echo "Test 1.4: Notification Service Health Check"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" http://localhost:8004/health)
echo "$RESPONSE"
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
[ "$HTTP_CODE" = "200" ] && test_result 0 "Notification service health endpoint" || test_result 1 "Notification service health endpoint (Expected 200, got $HTTP_CODE)"

echo "Test 1.5: Analytics Service Health Check"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" http://localhost:8005/health)
echo "$RESPONSE"
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
[ "$HTTP_CODE" = "200" ] && test_result 0 "Analytics service health endpoint" || test_result 1 "Analytics service health endpoint (Expected 200, got $HTTP_CODE)"

echo "=========================================="
echo "PHASE 2: USER SERVICE TESTS"
echo "=========================================="
echo ""

echo "Test 2.1: Create Valid User"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST http://localhost:8001/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice Johnson", "email": "alice@example.com"}')
echo "$RESPONSE"
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
[ "$HTTP_CODE" = "201" ] && test_result 0 "Create valid user" || test_result 1 "Create valid user (Expected 201, got $HTTP_CODE)"

echo "Test 2.2: Create User with Missing Name (Should Fail)"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST http://localhost:8001/api/users \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}')
echo "$RESPONSE"
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
[ "$HTTP_CODE" = "400" ] && test_result 0 "Reject user with missing name" || test_result 1 "Reject user with missing name (Expected 400, got $HTTP_CODE)"

echo "Test 2.3: Create User with Missing Email (Should Fail)"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST http://localhost:8001/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe"}')
echo "$RESPONSE"
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
[ "$HTTP_CODE" = "400" ] && test_result 0 "Reject user with missing email" || test_result 1 "Reject user with missing email (Expected 400, got $HTTP_CODE)"

echo "Test 2.4: Create Second User"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST http://localhost:8001/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Bob Smith", "email": "bob@example.com"}')
echo "$RESPONSE"
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
[ "$HTTP_CODE" = "201" ] && test_result 0 "Create second user" || test_result 1 "Create second user (Expected 201, got $HTTP_CODE)"

echo "Test 2.5: Get User by ID"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" http://localhost:8001/api/users/1)
echo "$RESPONSE"
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
[ "$HTTP_CODE" = "200" ] && test_result 0 "Get user by ID" || test_result 1 "Get user by ID (Expected 200, got $HTTP_CODE)"

echo "Test 2.6: Get Non-Existent User (Should Fail)"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" http://localhost:8001/api/users/999)
echo "$RESPONSE"
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
[ "$HTTP_CODE" = "404" ] && test_result 0 "Reject non-existent user" || test_result 1 "Reject non-existent user (Expected 404, got $HTTP_CODE)"

echo "Test 2.7: Get All Users"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" http://localhost:8001/api/users)
echo "$RESPONSE"
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
[ "$HTTP_CODE" = "200" ] && test_result 0 "Get all users" || test_result 1 "Get all users (Expected 200, got $HTTP_CODE)"

echo "Test 2.8: Update User"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X PUT http://localhost:8001/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice Updated", "email": "alice.updated@example.com"}')
echo "$RESPONSE"
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
[ "$HTTP_CODE" = "200" ] && test_result 0 "Update user" || test_result 1 "Update user (Expected 200, got $HTTP_CODE)"

echo "=========================================="
echo "PHASE 3: PRODUCT SERVICE TESTS"
echo "=========================================="
echo ""

echo "Test 3.1: Create Valid Product"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST http://localhost:8002/api/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Laptop", "price": 999.99, "stock": 50}')
echo "$RESPONSE"
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
[ "$HTTP_CODE" = "201" ] && test_result 0 "Create valid product" || test_result 1 "Create valid product (Expected 201, got $HTTP_CODE)"

echo "Test 3.2: Create Product with Negative Price (Should Fail)"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST http://localhost:8002/api/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Invalid Product", "price": -10, "stock": 50}')
echo "$RESPONSE"
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
[ "$HTTP_CODE" = "400" ] && test_result 0 "Reject product with negative price" || test_result 1 "Reject product with negative price (Expected 400, got $HTTP_CODE)"

echo "Test 3.3: Create Product with Negative Stock (Should Fail)"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST http://localhost:8002/api/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Invalid Product", "price": 100, "stock": -5}')
echo "$RESPONSE"
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
[ "$HTTP_CODE" = "400" ] && test_result 0 "Reject product with negative stock" || test_result 1 "Reject product with negative stock (Expected 400, got $HTTP_CODE)"

echo "Test 3.4: Create Product with Empty Name (Should Fail)"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST http://localhost:8002/api/products \
  -H "Content-Type: application/json" \
  -d '{"name": "", "price": 100, "stock": 10}')
echo "$RESPONSE"
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
[ "$HTTP_CODE" = "400" ] && test_result 0 "Reject product with empty name" || test_result 1 "Reject product with empty name (Expected 400, got $HTTP_CODE)"

echo "Test 3.5: Create Second Product"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST http://localhost:8002/api/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Mouse", "price": 29.99, "stock": 100}')
echo "$RESPONSE"
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
[ "$HTTP_CODE" = "201" ] && test_result 0 "Create second product" || test_result 1 "Create second product (Expected 201, got $HTTP_CODE)"

echo "Test 3.6: Get Product by ID"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" http://localhost:8002/api/products/1)
echo "$RESPONSE"
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
[ "$HTTP_CODE" = "200" ] && test_result 0 "Get product by ID" || test_result 1 "Get product by ID (Expected 200, got $HTTP_CODE)"

echo "Test 3.7: Get Non-Existent Product (Should Fail)"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" http://localhost:8002/api/products/999)
echo "$RESPONSE"
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
[ "$HTTP_CODE" = "404" ] && test_result 0 "Reject non-existent product" || test_result 1 "Reject non-existent product (Expected 404, got $HTTP_CODE)"

echo "Test 3.8: Get All Products"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" http://localhost:8002/api/products)
echo "$RESPONSE"
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
[ "$HTTP_CODE" = "200" ] && test_result 0 "Get all products" || test_result 1 "Get all products (Expected 200, got $HTTP_CODE)"

echo "Test 3.9: Update Product"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X PUT http://localhost:8002/api/products/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Gaming Laptop", "price": 1299.99, "stock": 30}')
echo "$RESPONSE"
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
[ "$HTTP_CODE" = "200" ] && test_result 0 "Update product" || test_result 1 "Update product (Expected 200, got $HTTP_CODE)"

echo "=========================================="
echo "PHASE 4: ORDER SERVICE TESTS (Inter-Service Communication)"
echo "=========================================="
echo ""

echo "Test 4.1: Create Valid Order (Tests User + Product + Notification Services)"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST http://localhost:8003/api/orders \
  -H "Content-Type: application/json" \
  -d '{"userId": "1", "productId": "1", "quantity": 2}')
echo "$RESPONSE"
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
[ "$HTTP_CODE" = "201" ] && test_result 0 "Create valid order with inter-service calls" || test_result 1 "Create valid order (Expected 201, got $HTTP_CODE)"

echo "Test 4.2: Create Order with Non-Existent User (Should Fail)"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST http://localhost:8003/api/orders \
  -H "Content-Type: application/json" \
  -d '{"userId": "999", "productId": "1", "quantity": 1}')
echo "$RESPONSE"
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
[ "$HTTP_CODE" = "400" ] && test_result 0 "Reject order with non-existent user" || test_result 1 "Reject order with non-existent user (Expected 400, got $HTTP_CODE)"

echo "Test 4.3: Create Order with Non-Existent Product (Should Fail)"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST http://localhost:8003/api/orders \
  -H "Content-Type: application/json" \
  -d '{"userId": "1", "productId": "999", "quantity": 1}')
echo "$RESPONSE"
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
[ "$HTTP_CODE" = "400" ] && test_result 0 "Reject order with non-existent product" || test_result 1 "Reject order with non-existent product (Expected 400, got $HTTP_CODE)"

echo "Test 4.4: Create Order with Missing Fields (Should Fail)"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST http://localhost:8003/api/orders \
  -H "Content-Type: application/json" \
  -d '{"userId": "1"}')
echo "$RESPONSE"
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
[ "$HTTP_CODE" = "400" ] && test_result 0 "Reject order with missing fields" || test_result 1 "Reject order with missing fields (Expected 400, got $HTTP_CODE)"

echo "Test 4.5: Create Second Order"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST http://localhost:8003/api/orders \
  -H "Content-Type: application/json" \
  -d '{"userId": "2", "productId": "2", "quantity": 3}')
echo "$RESPONSE"
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
[ "$HTTP_CODE" = "201" ] && test_result 0 "Create second order" || test_result 1 "Create second order (Expected 201, got $HTTP_CODE)"

echo "Test 4.6: Get Order by ID"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" http://localhost:8003/api/orders/1)
echo "$RESPONSE"
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
[ "$HTTP_CODE" = "200" ] && test_result 0 "Get order by ID" || test_result 1 "Get order by ID (Expected 200, got $HTTP_CODE)"

echo "Test 4.7: Get Non-Existent Order (Should Fail)"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" http://localhost:8003/api/orders/999)
echo "$RESPONSE"
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
[ "$HTTP_CODE" = "404" ] && test_result 0 "Reject non-existent order" || test_result 1 "Reject non-existent order (Expected 404, got $HTTP_CODE)"

echo "Test 4.8: Get All Orders"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" http://localhost:8003/api/orders)
echo "$RESPONSE"
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
[ "$HTTP_CODE" = "200" ] && test_result 0 "Get all orders" || test_result 1 "Get all orders (Expected 200, got $HTTP_CODE)"

echo "Test 4.9: Get Orders by User"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" http://localhost:8003/api/orders/user/1)
echo "$RESPONSE"
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
[ "$HTTP_CODE" = "200" ] && test_result 0 "Get orders by user" || test_result 1 "Get orders by user (Expected 200, got $HTTP_CODE)"

echo "=========================================="
echo "PHASE 5: NOTIFICATION SERVICE TESTS"
echo "=========================================="
echo ""

echo "Test 5.1: Send Manual Notification"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST http://localhost:8004/api/notifications/send \
  -H "Content-Type: application/json" \
  -d '{"userId": "1", "message": "Test notification", "type": "info"}')
echo "$RESPONSE"
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
[ "$HTTP_CODE" = "201" ] && test_result 0 "Send notification" || test_result 1 "Send notification (Expected 201, got $HTTP_CODE)"

echo "Test 5.2: Send Notification with Missing Fields (Should Fail)"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST http://localhost:8004/api/notifications/send \
  -H "Content-Type: application/json" \
  -d '{"userId": "1"}')
echo "$RESPONSE"
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
[ "$HTTP_CODE" = "400" ] && test_result 0 "Reject notification with missing fields" || test_result 1 "Reject notification with missing fields (Expected 400, got $HTTP_CODE)"

echo "Test 5.3: Get Notifications for User"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" http://localhost:8004/api/notifications/1)
echo "$RESPONSE"
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
[ "$HTTP_CODE" = "200" ] && test_result 0 "Get notifications for user" || test_result 1 "Get notifications for user (Expected 200, got $HTTP_CODE)"

echo "Test 5.4: Get All Notifications"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" http://localhost:8004/api/notifications)
echo "$RESPONSE"
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
[ "$HTTP_CODE" = "200" ] && test_result 0 "Get all notifications" || test_result 1 "Get all notifications (Expected 200, got $HTTP_CODE)"

echo "=========================================="
echo "PHASE 6: ANALYTICS SERVICE TESTS (Aggregation)"
echo "=========================================="
echo ""

echo "Test 6.1: Get System Summary (Calls All Services)"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" http://localhost:8005/api/analytics/summary)
echo "$RESPONSE"
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
[ "$HTTP_CODE" = "200" ] && test_result 0 "Get analytics summary" || test_result 1 "Get analytics summary (Expected 200, got $HTTP_CODE)"

echo "Test 6.2: Get User Statistics"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" http://localhost:8005/api/analytics/users)
echo "$RESPONSE"
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
[ "$HTTP_CODE" = "200" ] && test_result 0 "Get user statistics" || test_result 1 "Get user statistics (Expected 200, got $HTTP_CODE)"

echo "Test 6.3: Get Product Statistics"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" http://localhost:8005/api/analytics/products)
echo "$RESPONSE"
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
[ "$HTTP_CODE" = "200" ] && test_result 0 "Get product statistics" || test_result 1 "Get product statistics (Expected 200, got $HTTP_CODE)"

echo "Test 6.4: Get Order Statistics"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" http://localhost:8005/api/analytics/orders)
echo "$RESPONSE"
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
[ "$HTTP_CODE" = "200" ] && test_result 0 "Get order statistics" || test_result 1 "Get order statistics (Expected 200, got $HTTP_CODE)"

echo "=========================================="
echo "PHASE 7: DELETE OPERATIONS"
echo "=========================================="
echo ""

echo "Test 7.1: Delete Notification"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X DELETE http://localhost:8004/api/notifications/1)
echo "$RESPONSE"
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
[ "$HTTP_CODE" = "200" ] && test_result 0 "Delete notification" || test_result 1 "Delete notification (Expected 200, got $HTTP_CODE)"

echo "Test 7.2: Delete Product"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X DELETE http://localhost:8002/api/products/2)
echo "$RESPONSE"
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
[ "$HTTP_CODE" = "200" ] && test_result 0 "Delete product" || test_result 1 "Delete product (Expected 200, got $HTTP_CODE)"

echo "Test 7.3: Delete User"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X DELETE http://localhost:8001/api/users/2)
echo "$RESPONSE"
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
[ "$HTTP_CODE" = "200" ] && test_result 0 "Delete user" || test_result 1 "Delete user (Expected 200, got $HTTP_CODE)"

echo "Test 7.4: Verify Deleted User Not Found"
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" http://localhost:8001/api/users/2)
echo "$RESPONSE"
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
[ "$HTTP_CODE" = "404" ] && test_result 0 "Verify deleted user returns 404" || test_result 1 "Verify deleted user returns 404 (Expected 404, got $HTTP_CODE)"

echo ""
echo "=========================================="
echo "TEST SUMMARY"
echo "=========================================="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo "Total: $((PASSED + FAILED))"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED! Your microservices platform is working perfectly!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠️  Some tests failed. Review the output above for details.${NC}"
    exit 1
fi
