package main

import (
	"errors"
	"github.com/ak-karimzai/web-labs/cmd/server"
	"github.com/ak-karimzai/web-labs/pkg/db"
	"github.com/ak-karimzai/web-labs/pkg/handler"
	"github.com/ak-karimzai/web-labs/pkg/maker"
	"github.com/ak-karimzai/web-labs/pkg/repository"
	"github.com/ak-karimzai/web-labs/pkg/service"
	"github.com/joho/godotenv"
	"github.com/sirupsen/logrus"
	"github.com/spf13/viper"
	"golang.org/x/net/context"
	"os"
	"os/signal"
	"path/filepath"
	"syscall"
	"time"
)

// @title Goal tracker
// @version 0.1
// @description API Server for Goal tracker app

// @host localhost:3000
// @BasePath /api/v1

// @securityDefinitions.apikey ApiKeyAuth
// @in header
// @name Authorization
func main() {
	logger := logrus.New()
	//logrus.SetFormatter(new(logrus.JSONFormatter))
	if err := initConfig(); err != nil {
		logrus.Fatalf("error while loading configs: %s", err.Error())
	}

	if err := godotenv.Load(); err != nil {
		logrus.Fatalf("error while loading envoirment variables: %s", err.Error())
	}

	conn, err := db.NewPSQL(viper.GetString("db.host"),
		viper.GetString("db.port"),
		viper.GetString("db.username"),
		viper.GetString("db.dbname"),
		viper.GetString("db.sslmode"),
		os.Getenv("DB_PASSWORD"),
	)
	if err != nil {
		logrus.Fatalf("error while connecting to database: %s", err.Error())
	}

	duration, err := time.ParseDuration(os.Getenv("TOKEN_VALIDATION_TIME"))
	if err != nil {
		logrus.Fatal(err)
	}
	tokenMaker, err := maker.NewJWTToken(os.Getenv("TOKEN_SECRET_KEY"), duration)
	if err != nil {
		logrus.Fatal(err)
	}
	repos := repository.NewRepository(conn, logger)
	services := service.NewService(repos, tokenMaker, logger)
	handlers := handler.NewHandler(services, tokenMaker, logger)

	srv := new(server.Server)
	go func() {
		time.Sleep(time.Second)
		if err := srv.Run(viper.GetString("port"), handlers.InitRoutes()); err != nil {
			logrus.Fatalf("an error occured during start of server!")
		}
	}()
	logrus.Info("Server started")

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGTERM, syscall.SIGINT)
	<-quit

	logrus.Println("http server closing connection")

	if err := srv.Close(context.Background()); err != nil {
		logrus.Errorf("an error occured during closing connection with http server: %s", err.Error())
	}

	if err := conn.Close(context.Background()); err != nil {
		logrus.Errorf("an error occured on closing db connection: %s", err.Error())
	}
}

func initConfig() error {
	currentDir, err := os.Getwd()
	if err != nil {
		return errors.New("error while reading directory")
	}
	configDir := filepath.Join(currentDir, "config")
	viper.AddConfigPath(configDir)
	viper.SetConfigName("/config")
	return viper.ReadInConfig()
}
