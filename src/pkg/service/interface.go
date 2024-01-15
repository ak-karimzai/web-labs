package service

import (
	"context"
	"github.com/ak-karimzai/web-labs/pkg/ddo"
	"github.com/ak-karimzai/web-labs/pkg/model"
)

type Goal interface {
	Create(ctx context.Context, userId int, goal ddo.CreateGoal) (model.Goal, error)
	Get(ctx context.Context, userId int, listParams ddo.ListParams) ([]model.Goal, error)
	GetByID(ctx context.Context, userId, goalId int) (model.Goal, error)
	UpdateByID(ctx context.Context, userId, goalId int, update ddo.UpdateGoal) error
	DeleteByID(ctx context.Context, userId, goalId int) error
}

type Task interface {
	Create(ctx context.Context, userId, goalId int, task ddo.CreateTask) (model.Task, error)
	Get(ctx context.Context, userId, goalId int, listParams ddo.ListParams) ([]model.Task, error)
	GetByID(ctx context.Context, userId, taskId int) (model.Task, error)
	UpdateByID(ctx context.Context, userId, taskId int, task ddo.UpdateTask) error
	DeleteByID(ctx context.Context, userId, taskId int) error
}

type Auth interface {
	SignUp(ctx context.Context, up ddo.SignUp) error
	Login(ctx context.Context, in ddo.Login) (*ddo.LoginResponse, error)
}
