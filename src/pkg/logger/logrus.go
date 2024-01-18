package logger

import (
	"github.com/sirupsen/logrus"
	"os"
)

func NewLogger(logFilePath string) (Logger, error) {
	f, err := os.OpenFile(logFilePath, os.O_WRONLY|os.O_CREATE, 0755)
	if err != nil {
		return nil, err
	}

	logger := logrus.New()
	logger.SetOutput(f)
	logger.SetFormatter(&logrus.JSONFormatter{})
	return logger, nil
}
