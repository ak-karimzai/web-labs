package logger

import (
	"fmt"
	"github.com/sirupsen/logrus"
	"os"
)

func NewLogger(logFilePath string) (Logger, error) {
	f, err := os.OpenFile(logFilePath, os.O_RDWR|os.O_CREATE|os.O_APPEND, 0666)
	if err != nil {
		return nil, fmt.Errorf(
			"err in file %s: %w", logFilePath, err)
	}

	logger := logrus.New()
	logger.SetOutput(f)
	logger.SetFormatter(&logrus.JSONFormatter{})
	return logger, nil
}
