package service

import (
	"github.com/ak-karimzai/web-labs/pkg/logger"
	"github.com/ak-karimzai/web-labs/pkg/maker"
	"github.com/ak-karimzai/web-labs/pkg/repository"
	"github.com/ak-karimzai/web-labs/pkg/service/auth"
	"github.com/ak-karimzai/web-labs/pkg/service/goal"
	"github.com/ak-karimzai/web-labs/pkg/service/task"
)

type Service struct {
	Goal
	Task
	Auth
	maker.Maker
}

func NewService(repos *repository.Repository, tokenMaker maker.Maker, logger logger.Logger) *Service {
	return &Service{
		Goal:  goal.NewService(repos, logger),
		Task:  task.NewService(repos, logger),
		Auth:  auth.NewService(repos, tokenMaker, logger),
		Maker: tokenMaker,
	}
}
