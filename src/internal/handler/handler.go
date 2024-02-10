package handler

import (
	_ "github.com/ak-karimzai/web-labs/docs"
	"github.com/ak-karimzai/web-labs/internal/handler/auth"
	"github.com/ak-karimzai/web-labs/internal/handler/goal"
	"github.com/ak-karimzai/web-labs/internal/handler/middleware"
	"github.com/ak-karimzai/web-labs/internal/handler/task"
	"github.com/ak-karimzai/web-labs/internal/service"
	"github.com/ak-karimzai/web-labs/pkg/auth-token"
	"github.com/ak-karimzai/web-labs/pkg/logger"
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

type Handler struct {
	Goal
	Task
	Auth
	auth_token.Maker
}

func NewHandler(services *service.Service, tokenMaker auth_token.Maker, logger logger.Logger) *Handler {
	return &Handler{
		Goal:  goal.NewHandler(services, logger),
		Task:  task.NewHandler(services, logger),
		Auth:  auth.NewHandler(services, logger),
		Maker: tokenMaker,
	}
}

func (handler *Handler) InitRoutes(basePath string) *gin.Engine {
	router := gin.New()
	router.Use(gin.Logger())
	router.Use(middleware.Cors())

	api := router.Group(basePath)
	{
		api.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
		auth := api.Group("/auth")
		{
			auth.POST("/signup", handler.Auth.SignUp)
			auth.POST("/login", handler.Auth.Login)
		}

		goals := api.Group("/goals", middleware.UserAuthentication(handler.Maker))
		{
			goals.POST("/", handler.Goal.Create)
			goals.GET("/", handler.Goal.Get)
			goals.GET("/:id", handler.Goal.GetByID)
			goals.PATCH("/:id", handler.Goal.UpdateByID)
			goals.DELETE("/:id", handler.Goal.DeleteByID)
			goals.GET("/:id/tasks", handler.Task.Get)
			goals.POST("/:id/tasks", handler.Task.Create)
			goals.GET("/:id/tasks/:task_id", handler.Task.GetByID)
			goals.PUT("/:id/tasks/:task_id", handler.Task.UpdateByID)
			goals.DELETE("/:id/tasks/:task_id", handler.Task.DeleteByID)
		}
	}
	return router
}
