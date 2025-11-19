package com.example.order.service;

import com.example.order.config.AppConfig;
import com.example.order.model.Order;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class OrderService {

    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);

    private final Map<String, Order> orders = new ConcurrentHashMap<>();
    private final AtomicInteger nextId = new AtomicInteger(1);

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private AppConfig config;

    public Order createOrder(Order order) throws Exception {
        // Validate order
        if (!order.validate()) {
            throw new IllegalArgumentException("Invalid order data");
        }

        // Verify user exists
        if (!verifyUser(order.getUserId())) {
            throw new IllegalArgumentException("User not found");
        }

        // Verify product exists and get price
        Map<String, Object> product = verifyProduct(order.getProductId());
        if (product == null) {
            throw new IllegalArgumentException("Product not found");
        }

        // Calculate total price
        Double price = ((Number) product.get("price")).doubleValue();
        order.setTotalPrice(price * order.getQuantity());

        // Assign ID and save
        order.setId(String.valueOf(nextId.getAndIncrement()));
        order.setStatus("confirmed");
        orders.put(order.getId(), order);

        // Send notification (async, don't wait)
        try {
            sendNotification(order);
        } catch (Exception e) {
            logger.warn("Failed to send notification: {}", e.getMessage());
        }

        logger.info("Order created: {}", order.getId());
        return order;
    }

    public Order getOrder(String id) {
        return orders.get(id);
    }

    public List<Order> getAllOrders() {
        return new ArrayList<>(orders.values());
    }

    public List<Order> getOrdersByUser(String userId) {
        List<Order> userOrders = new ArrayList<>();
        for (Order order : orders.values()) {
            if (order.getUserId().equals(userId)) {
                userOrders.add(order);
            }
        }
        return userOrders;
    }

    private boolean verifyUser(String userId) {
        try {
            String url = config.getUserServiceUrl() + "/api/users/" + userId;
            restTemplate.getForObject(url, Map.class);
            return true;
        } catch (HttpClientErrorException.NotFound e) {
            return false;
        } catch (Exception e) {
            logger.error("Error verifying user: {}", e.getMessage());
            return false;
        }
    }

    private Map<String, Object> verifyProduct(String productId) {
        try {
            String url = config.getProductServiceUrl() + "/api/products/" + productId;
            return restTemplate.getForObject(url, Map.class);
        } catch (HttpClientErrorException.NotFound e) {
            return null;
        } catch (Exception e) {
            logger.error("Error verifying product: {}", e.getMessage());
            return null;
        }
    }

    private void sendNotification(Order order) {
        try {
            String url = config.getNotificationServiceUrl() + "/api/notifications/send";
            Map<String, Object> notification = new HashMap<>();
            notification.put("userId", order.getUserId());
            notification.put("message", "Your order #" + order.getId() + " has been confirmed");
            notification.put("type", "order_confirmation");

            restTemplate.postForObject(url, notification, Map.class);
        } catch (Exception e) {
            logger.warn("Failed to send notification: {}", e.getMessage());
        }
    }
}
