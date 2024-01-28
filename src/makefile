run:
	# GIN_MODE=release go run ./cmd/web/main.go
	go run ./cmd/web/main.go

migrate-up:
	migrate -path ./schema -database 'postgres://postgres:postgres@0.0.0.0:5432/postgres?sslmode=disable' up

migrate-down:
	migrate -path ./schema -database 'postgres://postgres:postgres@0.0.0.0:5432/postgres?sslmode=disable' down

generate-mock:
	 mockgen -destination ./internal/mock/goal/goals.go -package mock_goal "github.com/ak-karimzai/web-labs/internal/repository" Goal
	 mockgen -destination ./internal/mock/task/tasks.go -package mock_task "github.com/ak-karimzai/web-labs/internal/repository" Task
	 mockgen -destination ./internal/mock/user/user.go -package mock_user "github.com/ak-karimzai/web-labs/internal/repository" User

swag:
	swag init -g ./cmd/web/main.go