package logger

import (
	"encoding/json"
	"fmt"
	"os"
	"time"
)

type Logger struct {
	level string
}

type LogEntry struct {
	Timestamp string                 `json:"timestamp"`
	Level     string                 `json:"level"`
	Message   string                 `json:"message"`
	Data      map[string]interface{} `json:"data,omitempty"`
	Error     string                 `json:"error,omitempty"`
}

func New(level string) *Logger {
	return &Logger{level: level}
}

func (l *Logger) Info(message string, data map[string]interface{}) {
	l.log("INFO", message, data, nil)
}

func (l *Logger) Error(message string, err error, data map[string]interface{}) {
	errMsg := ""
	if err != nil {
		errMsg = err.Error()
	}
	l.log("ERROR", message, data, errMsg)
}

func (l *Logger) Warn(message string, data map[string]interface{}) {
	l.log("WARN", message, data, nil)
}

func (l *Logger) Debug(message string, data map[string]interface{}) {
	if l.level == "debug" {
		l.log("DEBUG", message, data, nil)
	}
}

func (l *Logger) log(level, message string, data map[string]interface{}, errMsg interface{}) {
	entry := LogEntry{
		Timestamp: time.Now().UTC().Format(time.RFC3339),
		Level:     level,
		Message:   message,
		Data:      data,
	}

	if errMsg != nil {
		if errStr, ok := errMsg.(string); ok && errStr != "" {
			entry.Error = errStr
		}
	}

	jsonData, err := json.Marshal(entry)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Failed to marshal log entry: %v\n", err)
		return
	}

	fmt.Println(string(jsonData))
}
