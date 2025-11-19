use std::env;

#[derive(Clone)]
pub struct Config {
    pub port: String,
    pub service_name: String,
    pub user_service_url: String,
    pub product_service_url: String,
    pub order_service_url: String,
    pub notification_service_url: String,
}

impl Config {
    pub fn new() -> Self {
        Config {
            port: env::var("PORT").unwrap_or_else(|_| "8005".to_string()),
            service_name: env::var("SERVICE_NAME").unwrap_or_else(|_| "analytics-service".to_string()),
            user_service_url: env::var("USER_SERVICE_URL").unwrap_or_else(|_| "http://user-service:8001".to_string()),
            product_service_url: env::var("PRODUCT_SERVICE_URL").unwrap_or_else(|_| "http://product-service:8002".to_string()),
            order_service_url: env::var("ORDER_SERVICE_URL").unwrap_or_else(|_| "http://order-service:8003".to_string()),
            notification_service_url: env::var("NOTIFICATION_SERVICE_URL").unwrap_or_else(|_| "http://notification-service:8004".to_string()),
        }
    }
}
