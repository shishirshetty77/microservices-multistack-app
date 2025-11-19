use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use actix_cors::Cors;
use serde::{Deserialize, Serialize};
use std::env;
use log::{info, error};
use env_logger::Env;

mod handlers;
mod config;
mod models;

use crate::handlers::{health_check, get_summary, get_user_stats, get_product_stats, get_order_stats};
use crate::config::Config;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Initialize logger
    env_logger::Builder::from_env(Env::default().default_filter_or("info")).init();

    // Load configuration
    let config = Config::new();
    
    info!("Starting {} on port {}", config.service_name, config.port);

    let server_config = config.clone();
    
    HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header();

        App::new()
            .wrap(cors)
            .app_data(web::Data::new(server_config.clone()))
            .route("/health", web::get().to(health_check))
            .route("/api/analytics/summary", web::get().to(get_summary))
            .route("/api/analytics/users", web::get().to(get_user_stats))
            .route("/api/analytics/products", web::get().to(get_product_stats))
            .route("/api/analytics/orders", web::get().to(get_order_stats))
    })
    .bind(format!("0.0.0.0:{}", config.port))?
    .run()
    .await
}
