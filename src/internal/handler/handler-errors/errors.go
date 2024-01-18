package handler_errors

import (
	"errors"
	service_errors "github.com/ak-karimzai/web-labs/internal/service/service-errors"
	"github.com/gin-gonic/gin"
	"net/http"
)

var (
	ErrAlreadyExist      = errors.New("Already exists")
	ErrBadRequest        = errors.New("Bad request")
	ErrUnauthorized      = errors.New("Unauthorized")
	ErrForbidden         = errors.New("Access fobidden")
	ErrBadCredentials    = errors.New("Bad credentials")
	ErrServerUnavailable = errors.New("something wrong in server")
	ErrNotFound          = errors.New("Not found")
	ErrPermissionDenied  = errors.New("Permission denied")
)

// ErrorResponse
// @Description request error message
type ErrorResponse struct {
	Message string `json:"message"`
}

func NewErrorResponse(c *gin.Context, statusCode int, message string) {
	c.AbortWithStatusJSON(statusCode, ErrorResponse{message})
}

func ParseServiceErrors(ctx *gin.Context, err error) (int, string) {
	var status = http.StatusBadRequest
	var message = err.Error()

	if errors.Is(err, service_errors.ErrNotFound) {
		status = http.StatusNotFound
		message = ErrNotFound.Error()
	} else if errors.Is(err, service_errors.ErrPermissionDenied) {
		status = http.StatusForbidden
		message = ErrForbidden.Error()
	} else if errors.Is(err, service_errors.ErrServiceNotAvailable) {
		status = http.StatusInternalServerError
		message = ErrServerUnavailable.Error()
	} else if errors.Is(err, service_errors.ErrAlreadyExists) {
		status = http.StatusConflict
		message = ErrAlreadyExist.Error()
	}
	return status, message
}
