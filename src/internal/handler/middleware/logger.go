package middleware

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"log"
	"time"
)

func Logger() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Start timer
		start := time.Now()

		// Process request
		c.Next()

		// Stop timer
		end := time.Now()
		latency := end.Sub(start)

		// Log request details
		status := c.Writer.Status()
		clientIP := c.ClientIP()
		method := c.Request.Method
		path := c.Request.URL.Path

		log.Printf("[GIN] %v | %3d | %13v | %15s | %s\n",
			end.Format("2006/01/02 - 15:04:05"),
			status,
			latency,
			clientIP,
			fmt.Sprintf("%s %s", method, path),
		)
	}
}
