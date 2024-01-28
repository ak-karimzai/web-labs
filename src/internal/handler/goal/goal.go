package goal

import (
	"encoding/json"
	"fmt"
	"github.com/ak-karimzai/web-labs/internal/dto"
	handler_errors "github.com/ak-karimzai/web-labs/internal/handler/handler-errors"
	"github.com/ak-karimzai/web-labs/internal/handler/middleware"
	"github.com/ak-karimzai/web-labs/internal/service"
	"github.com/ak-karimzai/web-labs/pkg/logger"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

type Handler struct {
	service *service.Service
	logger  logger.Logger
}

func NewHandler(service *service.Service, logger logger.Logger) *Handler {
	return &Handler{
		service: service,
		logger:  logger,
	}
}

// Create godoc
// @Security ApiKeyAuth
// @Summary      Create goal by system user
// @Description  Create goal request
// @Tags         Goal
// @Accept 	  json
// @Produce 	  json
// @Param input body dto.CreateGoal true "Create goal"
// @Success 201 {object} model.Goal
// @Failure 400 {object} handler_errors.ErrorResponse
// @Failure 401 {object} handler_errors.ErrorResponse
// @Failure 409 {object} handler_errors.ErrorResponse
// @Router /goals [post]
func (h Handler) Create(ctx *gin.Context) {
	var request dto.CreateGoal

	payload, err := middleware.GetUserInfo(ctx)
	if err != nil {
		h.logger.Error(err)
		handler_errors.NewErrorResponse(
			ctx,
			http.StatusUnauthorized,
			handler_errors.ErrUnauthorized.Error())
		return
	}

	if err := ctx.ShouldBind(&request); err != nil {
		h.logger.Error(err)
		handler_errors.NewErrorResponse(
			ctx,
			http.StatusBadRequest,
			handler_errors.ErrBadRequest.Error())
		return
	}

	goal, err := h.service.Goal.Create(ctx, payload.UserID, request)
	if err != nil {
		h.logger.Error(err)
		status, err := handler_errors.ParseServiceErrors(err)
		handler_errors.NewErrorResponse(
			ctx,
			status,
			err.Error())
		return
	}
	ctx.JSON(http.StatusCreated, goal)
}

// Get godoc
// @Security ApiKeyAuth
// @Summary      Get user goals
// @Description  Get a list of user goals
// @Tags         Goal
// @Accept 	  json
// @Produce 	  json
// @Param   page_id query  int   true  "number of the page"  minimum(1)  default(1)
// @Param   page_size query  int   true  "size of the page" minimum(5) minimum(20) default(5)
// @Success 200 {array} model.Goal
// @Failure 400 {object} handler_errors.ErrorResponse
// @Failure 401 {object} handler_errors.ErrorResponse
// @Router /goals [get]
func (h Handler) Get(ctx *gin.Context) {
	var listParams dto.ListParams

	payload, err := middleware.GetUserInfo(ctx)
	if err != nil {
		h.logger.Error(err)
		handler_errors.NewErrorResponse(
			ctx,
			http.StatusUnauthorized,
			handler_errors.ErrUnauthorized.Error())
		return
	}

	if err = ctx.BindQuery(&listParams); err != nil {
		h.logger.Error(err)
		handler_errors.NewErrorResponse(
			ctx,
			http.StatusBadRequest,
			handler_errors.ErrBadRequest.Error())
		return
	}

	goals, err := h.service.Goal.Get(ctx, payload.UserID, listParams)
	if err != nil {
		h.logger.Error(err)
		status, err := handler_errors.ParseServiceErrors(err)
		handler_errors.NewErrorResponse(
			ctx,
			status,
			err.Error())
		return
	}

	jsonData, err := json.Marshal(goals)
	if err != nil {
		println(err.Error())
		http.Error(ctx.Writer, "Error encoding JSON", http.StatusInternalServerError)
		return
	}

	// Set the content type to JSON
	ctx.Header("Content-Type", "application/json")

	// Write the JSON data to the response
	ctx.Writer.WriteHeader(http.StatusOK)
	ctx.Writer.Write(jsonData)

	//ctx.JSON(http.StatusOK, goals)
}

// GetByID godoc
// @Security ApiKeyAuth
// @Summary      Get user goal
// @Description  Get user goal by id
// @Tags         Goal
// @Accept 	  	 json
// @Produce 	  json
// @Param   id 	  path  int   true  "Goal id"
// @Success 200 {array} model.Goal
// @Failure 400 {object} handler_errors.ErrorResponse
// @Failure 401 {object} handler_errors.ErrorResponse
// @Failure 403 {object} handler_errors.ErrorResponse
// @Failure 404 {object} handler_errors.ErrorResponse
// @Router /goals/{id} [get]
func (h Handler) GetByID(ctx *gin.Context) {
	payload, err := middleware.GetUserInfo(ctx)
	if err != nil {
		h.logger.Error(err)
		handler_errors.NewErrorResponse(
			ctx,
			http.StatusUnauthorized,
			handler_errors.ErrUnauthorized.Error())
		return
	}

	id, _ := strconv.Atoi(ctx.Param("id"))
	if id <= 0 {
		message := fmt.Sprintf("incorrect id: %d", id)
		h.logger.Error(message)
		handler_errors.NewErrorResponse(
			ctx,
			http.StatusBadRequest,
			message)
		return
	}

	goal, err := h.service.Goal.GetByID(ctx, payload.UserID, id)
	if err != nil {
		h.logger.Error(err)
		status, err := handler_errors.ParseServiceErrors(err)
		handler_errors.NewErrorResponse(
			ctx,
			status,
			err.Error())
		return
	}
	ctx.JSON(http.StatusOK, goal)
}

// UpdateByID godoc
// @Security ApiKeyAuth
// @Summary      Update user goal
// @Description  update user goal by id
// @Tags         Goal
// @Accept 	  json
// @Produce 	  json
// @Param   id 	  path  int   true  "Goal id"
// @Param input body dto.UpdateGoal true "Update goal"
// @Success 204 {integer}  1
// @Failure 400 {object} handler_errors.ErrorResponse
// @Failure 401 {object} handler_errors.ErrorResponse
// @Failure 403 {object} handler_errors.ErrorResponse
// @Failure 404 {object} handler_errors.ErrorResponse
// @Failure 409 {object} handler_errors.ErrorResponse
// @Router /goals/{id} [patch]
func (h Handler) UpdateByID(ctx *gin.Context) {
	var request dto.UpdateGoal
	payload, err := middleware.GetUserInfo(ctx)
	if err != nil {
		h.logger.Error(err)
		handler_errors.NewErrorResponse(
			ctx,
			http.StatusUnauthorized,
			handler_errors.ErrUnauthorized.Error())
		return
	}

	id, _ := strconv.Atoi(ctx.Param("id"))
	if id <= 0 {
		message := fmt.Sprintf("incorrect id: %d", id)
		h.logger.Error(message)
		handler_errors.NewErrorResponse(
			ctx,
			http.StatusBadRequest,
			message)
		return
	}

	if err := ctx.BindJSON(&request); err != nil {
		h.logger.Error(err)
		handler_errors.NewErrorResponse(
			ctx,
			http.StatusBadRequest,
			handler_errors.ErrBadRequest.Error())
		return
	}

	err = h.service.Goal.UpdateByID(ctx, payload.UserID, id, request)
	if err != nil {
		h.logger.Error(err)
		status, err := handler_errors.ParseServiceErrors(err)
		handler_errors.NewErrorResponse(
			ctx,
			status,
			err.Error())
		return
	}
	ctx.Status(http.StatusOK)
}

// DeleteByID godoc
// @Security ApiKeyAuth
// @Summary      Delete user goal
// @Description  delete user goal by id
// @Tags         Goal
// @Accept 	  json
// @Produce 	  json
// @Param   id 	  path  int   true  "Goal id"
// @Success 200 {integer}  1
// @Failure 400 {object} handler_errors.ErrorResponse
// @Failure 401 {object} handler_errors.ErrorResponse
// @Failure 403 {object} handler_errors.ErrorResponse
// @Failure 404 {object} handler_errors.ErrorResponse
// @Router /goals/{id} [delete]
func (h Handler) DeleteByID(ctx *gin.Context) {
	payload, err := middleware.GetUserInfo(ctx)
	if err != nil {
		h.logger.Error(err)
		handler_errors.NewErrorResponse(
			ctx,
			http.StatusUnauthorized,
			handler_errors.ErrUnauthorized.Error())
		return
	}

	id, err := strconv.Atoi(ctx.Param("id"))
	if id <= 0 {
		message := fmt.Sprintf("incorrect id: %d", id)
		h.logger.Error(message)
		handler_errors.NewErrorResponse(
			ctx,
			http.StatusBadRequest,
			message)
		return
	}

	err = h.service.Goal.DeleteByID(ctx, payload.UserID, id)
	if err != nil {
		h.logger.Error(err)
		status, err := handler_errors.ParseServiceErrors(err)
		handler_errors.NewErrorResponse(
			ctx,
			status,
			err.Error())
		return
	}
	ctx.Status(http.StatusOK)
}
