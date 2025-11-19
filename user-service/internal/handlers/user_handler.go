package handlers

import (
	"encoding/json"
	"net/http"
	"time"
	"user-service/internal/db"
	"user-service/internal/logger"
	"user-service/internal/models"

	"github.com/gorilla/mux"
)

type UserHandler struct {
	db     *db.DB
	logger *logger.Logger
}

func NewUserHandler(database *db.DB, log *logger.Logger) *UserHandler {
	return &UserHandler{
		db:     database,
		logger: log,
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

	if err := h.db.CreateUser(&user); err != nil {
		h.logger.Error("Failed to create user in database", err, nil)
		respondWithError(w, http.StatusInternalServerError, "Failed to create user")
		return
	}

	h.logger.Info("User created", map[string]interface{}{"userId": user.ID})
	respondWithJSON(w, http.StatusCreated, user)
}

func (h *UserHandler) GetUser(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	user, err := h.db.GetUser(id)
	if err != nil {
		h.logger.Error("Failed to get user from database", err, nil)
		respondWithError(w, http.StatusInternalServerError, "Failed to get user")
		return
	}

	if user == nil {
		respondWithError(w, http.StatusNotFound, "User not found")
		return
	}

	respondWithJSON(w, http.StatusOK, user)
}

func (h *UserHandler) GetUsers(w http.ResponseWriter, r *http.Request) {
	users, err := h.db.GetAllUsers()
	if err != nil {
		h.logger.Error("Failed to get users from database", err, nil)
		respondWithError(w, http.StatusInternalServerError, "Failed to get users")
		return
	}

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

	user, err := h.db.UpdateUser(id, updatedUser.Name, updatedUser.Email)
	if err != nil {
		h.logger.Error("Failed to update user in database", err, nil)
		respondWithError(w, http.StatusInternalServerError, "Failed to update user")
		return
	}

	if user == nil {
		respondWithError(w, http.StatusNotFound, "User not found")
		return
	}

	h.logger.Info("User updated", map[string]interface{}{"userId": id})
	respondWithJSON(w, http.StatusOK, user)
}

func (h *UserHandler) DeleteUser(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	err := h.db.DeleteUser(id)
	if err != nil {
		h.logger.Error("Failed to delete user from database", err, nil)
		respondWithError(w, http.StatusNotFound, "User not found")
		return
	}

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
