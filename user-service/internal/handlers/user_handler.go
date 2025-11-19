package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sync"
	"time"
	"user-service/internal/logger"
	"user-service/internal/models"

	"github.com/gorilla/mux"
)

type UserHandler struct {
	users  map[string]*models.User
	mu     sync.RWMutex
	logger *logger.Logger
	nextID int
}

func NewUserHandler(log *logger.Logger) *UserHandler {
	return &UserHandler{
		users:  make(map[string]*models.User),
		logger: log,
		nextID: 1,
	}
}

func (h *UserHandler) CreateUser(w http.ResponseWriter, r *http.Request) {
	var user models.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		h.logger.Error("Failed to decode user", err, nil)
		respondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	if err := user.Validate(); err != nil {
		h.logger.Error("User validation failed", err, nil)
		respondWithError(w, http.StatusBadRequest, err.Error())
		return
	}

	h.mu.Lock()
	user.ID = fmt.Sprintf("%d", h.nextID)
	h.nextID++
	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()
	h.users[user.ID] = &user
	h.mu.Unlock()

	h.logger.Info("User created", map[string]interface{}{"userId": user.ID})
	respondWithJSON(w, http.StatusCreated, user)
}

func (h *UserHandler) GetUser(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	h.mu.RLock()
	user, exists := h.users[id]
	h.mu.RUnlock()

	if !exists {
		respondWithError(w, http.StatusNotFound, "User not found")
		return
	}

	respondWithJSON(w, http.StatusOK, user)
}

func (h *UserHandler) GetUsers(w http.ResponseWriter, r *http.Request) {
	h.mu.RLock()
	users := make([]*models.User, 0, len(h.users))
	for _, user := range h.users {
		users = append(users, user)
	}
	h.mu.RUnlock()

	respondWithJSON(w, http.StatusOK, users)
}

func (h *UserHandler) UpdateUser(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	var updatedUser models.User
	if err := json.NewDecoder(r.Body).Decode(&updatedUser); err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	if err := updatedUser.Validate(); err != nil {
		respondWithError(w, http.StatusBadRequest, err.Error())
		return
	}

	h.mu.Lock()
	user, exists := h.users[id]
	if !exists {
		h.mu.Unlock()
		respondWithError(w, http.StatusNotFound, "User not found")
		return
	}

	user.Name = updatedUser.Name
	user.Email = updatedUser.Email
	user.UpdatedAt = time.Now()
	h.mu.Unlock()

	h.logger.Info("User updated", map[string]interface{}{"userId": id})
	respondWithJSON(w, http.StatusOK, user)
}

func (h *UserHandler) DeleteUser(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	h.mu.Lock()
	_, exists := h.users[id]
	if !exists {
		h.mu.Unlock()
		respondWithError(w, http.StatusNotFound, "User not found")
		return
	}

	delete(h.users, id)
	h.mu.Unlock()

	h.logger.Info("User deleted", map[string]interface{}{"userId": id})
	respondWithJSON(w, http.StatusOK, map[string]string{"message": "User deleted successfully"})
}

func (h *UserHandler) HealthCheck(w http.ResponseWriter, r *http.Request) {
	respondWithJSON(w, http.StatusOK, map[string]interface{}{
		"status":  "healthy",
		"service": "user-service",
		"time":    time.Now().UTC(),
	})
}

func respondWithError(w http.ResponseWriter, code int, message string) {
	respondWithJSON(w, code, map[string]string{"error": message})
}

func respondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
	response, _ := json.Marshal(payload)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(response)
}
