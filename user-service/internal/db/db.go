package db

import (
	"database/sql"
	"fmt"
	"time"
	"user-service/internal/logger"
	"user-service/internal/models"

	_ "github.com/lib/pq"
)

type DB struct {
	conn   *sql.DB
	logger *logger.Logger
}

func New(host, port, user, password, dbname string, log *logger.Logger) (*DB, error) {
	connStr := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)

	conn, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	if err := conn.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	log.Info("Successfully connected to database", nil)

	return &DB{
		conn:   conn,
		logger: log,
	}, nil
}

func (db *DB) Close() error {
	return db.conn.Close()
}

func (db *DB) CreateUser(user *models.User) error {
	query := `INSERT INTO users (name, email, created_at, updated_at) VALUES ($1, $2, $3, $4) RETURNING id`

	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()

	err := db.conn.QueryRow(query, user.Name, user.Email, user.CreatedAt, user.UpdatedAt).Scan(&user.ID)
	if err != nil {
		return fmt.Errorf("failed to create user: %w", err)
	}

	return nil
}

func (db *DB) GetUser(id string) (*models.User, error) {
	query := `SELECT id, name, email, created_at, updated_at FROM users WHERE id = $1`

	user := &models.User{}
	err := db.conn.QueryRow(query, id).Scan(&user.ID, &user.Name, &user.Email, &user.CreatedAt, &user.UpdatedAt)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get user: %w", err)
	}

	return user, nil
}

func (db *DB) GetAllUsers() ([]*models.User, error) {
	query := `SELECT id, name, email, created_at, updated_at FROM users ORDER BY created_at DESC`

	rows, err := db.conn.Query(query)
	if err != nil {
		return nil, fmt.Errorf("failed to query users: %w", err)
	}
	defer rows.Close()

	users := []*models.User{}
	for rows.Next() {
		user := &models.User{}
		err := rows.Scan(&user.ID, &user.Name, &user.Email, &user.CreatedAt, &user.UpdatedAt)
		if err != nil {
			return nil, fmt.Errorf("failed to scan user: %w", err)
		}
		users = append(users, user)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating users: %w", err)
	}

	return users, nil
}

func (db *DB) UpdateUser(id string, name, email string) (*models.User, error) {
	query := `UPDATE users SET name = $1, email = $2, updated_at = $3 WHERE id = $4 RETURNING id, name, email, created_at, updated_at`

	user := &models.User{}
	err := db.conn.QueryRow(query, name, email, time.Now(), id).Scan(&user.ID, &user.Name, &user.Email, &user.CreatedAt, &user.UpdatedAt)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to update user: %w", err)
	}

	return user, nil
}

func (db *DB) DeleteUser(id string) error {
	query := `DELETE FROM users WHERE id = $1`

	result, err := db.conn.Exec(query, id)
	if err != nil {
		return fmt.Errorf("failed to delete user: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("failed to get rows affected: %w", err)
	}

	if rowsAffected == 0 {
		return sql.ErrNoRows
	}

	return nil
}
