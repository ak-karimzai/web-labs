package handler

import (
	"github.com/ak-karimzai/web-labs/pkg/handler/auth"
	"github.com/ak-karimzai/web-labs/pkg/handler/goal"
	"github.com/ak-karimzai/web-labs/pkg/handler/middleware"
	"github.com/ak-karimzai/web-labs/pkg/handler/task"
	"github.com/ak-karimzai/web-labs/pkg/logger"
	"github.com/ak-karimzai/web-labs/pkg/maker"
	"github.com/ak-karimzai/web-labs/pkg/service"
	"github.com/gin-gonic/gin"

	_ "github.com/ak-karimzai/web-labs/docs"
	"github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

type Handler struct {
	Goal
	Task
	Auth
	maker.Maker
}

func NewHandler(services *service.Service, tokenMaker maker.Maker, logger logger.Logger) *Handler {
	return &Handler{
		Goal:  goal.NewHandler(services, logger),
		Task:  task.NewHandler(services, logger),
		Auth:  auth.NewHandler(services, logger),
		Maker: tokenMaker,
	}
}

func (handler *Handler) InitRoutes() *gin.Engine {
	router := gin.New()

	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	api := router.Group("/api")
	{
		v1 := api.Group("/v1")
		{
			auth := v1.Group("/auth")
			{
				auth.POST("/signup", handler.Auth.SignUp)
				auth.POST("/login", handler.Auth.Login)
			}

			goals := v1.Group("/goals", middleware.UserAuthentication(handler.Maker))
			{
				handler.setGoalRouter(goals)
			}

			tasks := v1.Group("/tasks", middleware.UserAuthentication(handler.Maker))
			{
				handler.setTaskRouter(tasks)
			}
		}
	}
	return router
}

func (handler *Handler) setGoalRouter(goal *gin.RouterGroup) {
	goal.POST("/", handler.Goal.Create)
	goal.GET("/", handler.Goal.Get)
	goal.GET("/:id", handler.Goal.GetByID)
	goal.PATCH("/:id", handler.Goal.UpdateByID)
	goal.DELETE("/:id", handler.Goal.DeleteByID)
	goal.GET("/tasks", handler.Task.Get)
	goal.POST("/tasks", handler.Task.Create)
}

func (handler *Handler) setTaskRouter(task *gin.RouterGroup) {
	task.GET("/:id", handler.Task.GetByID)
	task.PUT("/:id", handler.Task.UpdateByID)
	task.DELETE("/:id", handler.Task.DeleteByID)
}
