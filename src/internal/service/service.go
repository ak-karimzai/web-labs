package service

import (
	"github.com/ak-karimzai/web-labs/internal/repository"
	"github.com/ak-karimzai/web-labs/internal/service/auth"
	"github.com/ak-karimzai/web-labs/internal/service/goal"
	"github.com/ak-karimzai/web-labs/internal/service/task"
	"github.com/ak-karimzai/web-labs/pkg/auth-token"
	"github.com/ak-karimzai/web-labs/pkg/logger"
)

type Service struct {
	Goal
	Task
	Auth
	auth_token.Maker
}

func NewService(repos *repository.Repository, tokenMaker auth_token.Maker, logger logger.Logger) *Service {
	return &Service{
		Goal:  goal.NewService(repos, logger),
		Task:  task.NewService(repos, logger),
		Auth:  auth.NewService(repos, tokenMaker, logger),
		Maker: tokenMaker,
	}
}
