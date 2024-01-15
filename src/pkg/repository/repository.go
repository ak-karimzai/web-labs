package repository

import (
	"github.com/ak-karimzai/web-labs/pkg/db"
	"github.com/ak-karimzai/web-labs/pkg/logger"
	"github.com/ak-karimzai/web-labs/pkg/repository/goal"
	"github.com/ak-karimzai/web-labs/pkg/repository/task"
	"github.com/ak-karimzai/web-labs/pkg/repository/user"
)

type Repository struct {
	Goal
	Task
	User
}

func NewRepository(db *db.DB, logger logger.Logger) *Repository {
	return &Repository{
		Goal: goal.NewRepository(db, logger),
		Task: task.NewRepository(db, logger),
		User: user.NewRepository(db, logger),
	}
}
