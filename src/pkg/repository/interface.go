package repository

import (
	"context"
	"github.com/ak-karimzai/web-labs/pkg/ddo"
	"github.com/ak-karimzai/web-labs/pkg/model"
)

type Goal interface {
	Create(ctx context.Context, userId int, goal ddo.CreateGoal) (int, error)
	Get(ctx context.Context, userId int, listParams ddo.ListParams) ([]model.Goal, error)
	GetByID(ctx context.Context, goalId int) (model.Goal, error)
	UpdateByID(ctx context.Context, goalId int, update ddo.UpdateGoal) error
	DeleteByID(ctx context.Context, goalId int) error
}

type Task interface {
	Create(ctx context.Context, goalId int, task ddo.CreateTask) (int, error)
	Get(ctx context.Context, goalId int, listParams ddo.ListParams) ([]model.Task, error)
	GetByID(ctx context.Context, taskId int) (model.Task, error)
	UpdateByID(ctx context.Context, taskId int, task ddo.UpdateTask) error
	DeleteByID(ctx context.Context, taskId int) error
}

type User interface {
	SignUp(ctx context.Context, up ddo.SignUp) error
	GetUserByName(ctx context.Context, username string) (model.User, error)
}
