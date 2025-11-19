package com.example.order.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

    @Value("${app.user-service.url:http://user-service:8001}")
    private String userServiceUrl;

    @Value("${app.product-service.url:http://product-service:8002}")
    private String productServiceUrl;

    @Value("${app.notification-service.url:http://notification-service:8004}")
    private String notificationServiceUrl;

    public String getUserServiceUrl() {
        return userServiceUrl;
    }

    public String getProductServiceUrl() {
        return productServiceUrl;
    }

    public String getNotificationServiceUrl() {
        return notificationServiceUrl;
    }
}
