package main

import (
	"github.com/ak-karimzai/web-labs/cmd/server"
	"github.com/ak-karimzai/web-labs/internal/handler"
	"github.com/ak-karimzai/web-labs/internal/repository"
	"github.com/ak-karimzai/web-labs/internal/service"
	"github.com/ak-karimzai/web-labs/pkg/auth-token"
	"github.com/ak-karimzai/web-labs/pkg/db"
	"github.com/ak-karimzai/web-labs/pkg/logger"
	"github.com/ak-karimzai/web-labs/pkg/util"
	"golang.org/x/net/context"
	"log"
	"os"
	"os/signal"
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
	config, err := util.NewConfig()
	if err != nil {
		log.Fatalf("error while loading configs: %s", err.Error())
	}

	lgr, err := logger.NewLogger(config.LoggerFilePath)
	if err != nil {
		log.Fatal(err)
	}

	tokenMaker, err := auth_token.NewJWTToken(config.TokenSecretKey, config.TokenValidationTime)
	if err != nil {
		lgr.Fatal(err)
	}

	if err = db.Migrate(config.MigrationUrl,
		config.DBHost,
		config.DBPort,
		config.DBUsername,
		config.DBName,
		config.SSLMode,
		config.DBPassword); err != nil {
		lgr.Fatal(err)
	}

	conn, err := db.NewPSQL(config.DBHost,
		config.DBPort,
		config.DBUsername,
		config.DBName,
		config.SSLMode,
		config.DBPassword,
	)
	if err != nil {
		lgr.Fatalf("error while connecting to database: %s", err.Error())
	}

	repos := repository.NewRepository(conn, lgr)
	services := service.NewService(repos, tokenMaker, lgr)
	handlers := handler.NewHandler(services, tokenMaker, lgr)

	srv := new(server.Server)
	go func() {
		time.Sleep(time.Second)
		if err := srv.Run(config.ServerPort, handlers.InitRoutes()); err != nil {
			lgr.Fatalf("an error occured during start of server: %s", err)
		}
	}()
	lgr.Info("Server started")

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGTERM, syscall.SIGINT)
	<-quit

	lgr.Info("http server closes connections")

	if err := srv.Close(context.Background()); err != nil {
		lgr.Errorf("an error occured during closing connection with http server: %s", err.Error())
	}

	if err := conn.Close(context.Background()); err != nil {
		lgr.Errorf("an error occured on closing db connection: %s", err.Error())
	}
}
