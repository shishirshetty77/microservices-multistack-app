use actix_web::{web, HttpResponse, Responder};
use chrono::Utc;
use log::{info, error};
use serde_json::Value;

use crate::config::Config;
use crate::models::{HealthResponse, Summary, UserStats, ProductStats, OrderStats};

pub async fn health_check(config: web::Data<Config>) -> impl Responder {
    let response = HealthResponse {
        status: "healthy".to_string(),
        service: config.service_name.clone(),
        time: Utc::now(),
    };
    
    HttpResponse::Ok().json(response)
}

pub async fn get_summary(config: web::Data<Config>) -> impl Responder {
    info!("Fetching system summary");

    let users_count = fetch_count(&format!("{}/api/users", config.user_service_url)).await;
    let products_count = fetch_count(&format!("{}/api/products", config.product_service_url)).await;
    let orders_count = fetch_count(&format!("{}/api/orders", config.order_service_url)).await;
    let notifications_count = fetch_count(&format!("{}/api/notifications", config.notification_service_url)).await;

    let summary = Summary {
        total_users: users_count,
        total_products: products_count,
        total_orders: orders_count,
        total_notifications: notifications_count,
        timestamp: Utc::now(),
    };

    HttpResponse::Ok().json(summary)
}

pub async fn get_user_stats(config: web::Data<Config>) -> impl Responder {
    info!("Fetching user statistics");

    let count = fetch_count(&format!("{}/api/users", config.user_service_url)).await;

    let stats = UserStats {
        total: count,
        timestamp: Utc::now(),
    };

    HttpResponse::Ok().json(stats)
}

pub async fn get_product_stats(config: web::Data<Config>) -> impl Responder {
    info!("Fetching product statistics");

    let count = fetch_count(&format!("{}/api/products", config.product_service_url)).await;

    let stats = ProductStats {
        total: count,
        timestamp: Utc::now(),
    };

    HttpResponse::Ok().json(stats)
}

pub async fn get_order_stats(config: web::Data<Config>) -> impl Responder {
    info!("Fetching order statistics");

    let count = fetch_count(&format!("{}/api/orders", config.order_service_url)).await;

    let stats = OrderStats {
        total: count,
        timestamp: Utc::now(),
    };

    HttpResponse::Ok().json(stats)
}

async fn fetch_count(url: &str) -> usize {
    match reqwest::get(url).await {
        Ok(response) => {
            match response.json::<Value>().await {
                Ok(json) => {
                    if let Some(array) = json.as_array() {
                        array.len()
                    } else {
                        0
                    }
                }
                Err(e) => {
                    error!("Failed to parse response from {}: {}", url, e);
                    0
                }
            }
        }
        Err(e) => {
            error!("Failed to fetch from {}: {}", url, e);
            0
        }
    }
}
