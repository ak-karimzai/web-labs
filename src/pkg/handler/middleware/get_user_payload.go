package middleware

import (
	"errors"
	handler_errors "github.com/ak-karimzai/web-labs/pkg/handler/handler-errors"
	"github.com/ak-karimzai/web-labs/pkg/maker"
	"github.com/gin-gonic/gin"
	"net/http"
	"strings"
)

var (
	ErrInvalidAuthHeader     = errors.New("invalid credentials")
	ErrUnsupportedAuthHeader = errors.New("unsupported auth header by user")
	ErrInvalidToken          = errors.New("invalid token")
	ErrCredentialsNotFound   = errors.New("user info not found")
)

const (
	authorizationHeader = "Authorization"
	supportedAuth       = "bearer"
	key                 = "userInfo"
)

func UserAuthentication(tokenMaker maker.Maker) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		header := ctx.GetHeader(authorizationHeader)
		if header == "" {
			handler_errors.NewErrorResponse(
				ctx,
				http.StatusUnauthorized,
				ErrInvalidAuthHeader.Error())
			return
		}

		headerParts := strings.Split(header, " ")
		if len(headerParts) != 2 || strings.ToLower(headerParts[0]) != supportedAuth {
			handler_errors.NewErrorResponse(
				ctx,
				http.StatusUnauthorized,
				ErrUnsupportedAuthHeader.Error())
			return
		}

		if len(headerParts[1]) == 0 {
			handler_errors.NewErrorResponse(ctx, http.StatusUnauthorized, ErrInvalidToken.Error())
			return
		}

		userInfo, err := tokenMaker.VerifyToken(headerParts[1])
		if err != nil {
			handler_errors.NewErrorResponse(ctx, http.StatusUnauthorized, ErrInvalidToken.Error())
			return
		}

		ctx.Set(key, userInfo)
	}

}

func GetUserInfo(c *gin.Context) (*maker.Payload, error) {
	userInfo, ok := c.Get(key)
	if !ok {
		return nil, ErrCredentialsNotFound
	}

	info, ok := userInfo.(*maker.Payload)
	if !ok {
		return nil, ErrInvalidAuthHeader
	}

	return info, nil
}
