package main

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
	"user-service/internal/config"
	"user-service/internal/db"
	"user-service/internal/handlers"
	"user-service/internal/logger"

	"github.com/gorilla/mux"
)

func main() {
	// Initialize configuration
	cfg := config.Load()

	// Initialize logger
	log := logger.New(cfg.LogLevel)
	log.Info("Starting User Service", map[string]interface{}{
		"port":    cfg.Port,
		"service": cfg.ServiceName,
	})

	// Initialize database
	database, err := db.New(
		getEnv("DB_HOST", "postgres"),
		getEnv("DB_PORT", "5432"),
		getEnv("DB_USER", "microservices"),
		getEnv("DB_PASSWORD", "microservices123"),
		getEnv("DB_NAME", "microservices"),
		log,
	)
	if err != nil {
		log.Error("Failed to connect to database", err, nil)
		os.Exit(1)
	}
	defer database.Close()

	// Initialize router
	router := mux.NewRouter()

	// Initialize handlers
	userHandler := handlers.NewUserHandler(database, log)

	// API routes
	api := router.PathPrefix("/api").Subrouter()
	api.HandleFunc("/users", userHandler.CreateUser).Methods("POST")
	api.HandleFunc("/users", userHandler.GetUsers).Methods("GET")
	api.HandleFunc("/users/{id}", userHandler.GetUser).Methods("GET")
	api.HandleFunc("/users/{id}", userHandler.UpdateUser).Methods("PUT")
	api.HandleFunc("/users/{id}", userHandler.DeleteUser).Methods("DELETE")

	// Health check
	router.HandleFunc("/health", userHandler.HealthCheck).Methods("GET")

	// CORS middleware
	router.Use(corsMiddleware)
	router.Use(loggingMiddleware(log))

	// Create server
	srv := &http.Server{
		Addr:         fmt.Sprintf(":%s", cfg.Port),
		Handler:      router,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Start server in goroutine
	go func() {
		log.Info("Server listening", map[string]interface{}{"port": cfg.Port})
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Error("Server failed to start", err, nil)
			os.Exit(1)
		}
	}()

	// Graceful shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Info("Shutting down server...", nil)

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Error("Server forced to shutdown", err, nil)
	}

	log.Info("Server exited", nil)
}

func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func loggingMiddleware(log *logger.Logger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			start := time.Now()
			next.ServeHTTP(w, r)
			log.Info("Request", map[string]interface{}{
				"method":   r.Method,
				"path":     r.URL.Path,
				"duration": time.Since(start).Milliseconds(),
			})
		})
	}
}
