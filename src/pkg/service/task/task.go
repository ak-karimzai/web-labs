package task

import (
	"context"
	"errors"
	"github.com/ak-karimzai/web-labs/pkg/db"
	"github.com/ak-karimzai/web-labs/pkg/ddo"
	"github.com/ak-karimzai/web-labs/pkg/logger"
	"github.com/ak-karimzai/web-labs/pkg/model"
	"github.com/ak-karimzai/web-labs/pkg/repository"
	service_errors "github.com/ak-karimzai/web-labs/pkg/service/service-errors"
)

type Service struct {
	repo   *repository.Repository
	logger logger.Logger
}

func NewService(repo *repository.Repository, logger logger.Logger) *Service {
	return &Service{repo: repo, logger: logger}
}

func (s Service) Create(ctx context.Context, userId, goalId int, task ddo.CreateTask) (model.Task, error) {
	if err := task.Validate(); err != nil {
		s.logger.Error(err)
		return model.Task{}, service_errors.ErrInvalidCredentials
	}

	goal, err := s.repo.Goal.GetByID(ctx, goalId)
	if err != nil {
		s.logger.Error(err)
		return model.Task{}, err
	}

	if goal.UserID != userId {
		s.logger.Print("permission denied")
		return model.Task{}, service_errors.ErrPermissionDenied
	}

	id, err := s.repo.Task.Create(ctx, goalId, task)
	if err != nil {
		s.logger.Error(err)
		return model.Task{},
			service_errors.ErrServiceNotAvailable
	}

	taskFromDB, err := s.repo.Task.GetByID(ctx, id)
	if err != nil {
		s.logger.Error(err)
		var err = service_errors.ErrServiceNotAvailable
		if errors.Is(err, db.ErrNotFound) {
			err = service_errors.ErrNotFound
		}
		return model.Task{}, err
	}
	return taskFromDB, nil
}

func (s Service) Get(ctx context.Context, userId, goalId int, listParams ddo.ListParams) ([]model.Task, error) {
	if err := listParams.Validate(); err != nil {
		s.logger.Error(err)
		return []model.Task{}, service_errors.ErrInvalidCredentials
	}

	goal, err := s.repo.Goal.GetByID(ctx, goalId)
	if err != nil {
		s.logger.Error(err)
		return []model.Task{}, err
	}

	if goal.UserID != userId {
		s.logger.Print("permission denied")
		return []model.Task{}, service_errors.ErrPermissionDenied
	}

	tasks, err := s.repo.Task.Get(ctx, userId, listParams)
	if err != nil {
		s.logger.Error(err)
		var err = service_errors.ErrServiceNotAvailable
		if errors.Is(err, db.ErrNotFound) {
			err = service_errors.ErrNotFound
		}
		return []model.Task{}, err
	}
	return tasks, nil
}

func (s Service) GetByID(ctx context.Context, userId, taskId int) (model.Task, error) {
	task, err := s.repo.Task.GetByID(ctx, taskId)
	if err != nil {
		s.logger.Error(err)
		if errors.Is(err, db.ErrNotFound) {
			return model.Task{}, service_errors.ErrNotFound
		}
		return model.Task{}, service_errors.ErrServiceNotAvailable
	}

	goal, err := s.repo.Goal.GetByID(ctx, task.GoalID)
	if err != nil {
		s.logger.Error(err)
		if errors.Is(err, db.ErrNotFound) {
			return model.Task{}, service_errors.ErrNotFound
		}
		return model.Task{}, service_errors.ErrServiceNotAvailable
	}

	if goal.UserID != userId {
		s.logger.Print("permission denied")
		return model.Task{}, service_errors.ErrPermissionDenied
	}

	return task, nil
}

func (s Service) UpdateByID(ctx context.Context, userId, taskId int, task ddo.UpdateTask) error {
	if err := task.Validate(); err != nil {
		s.logger.Error(err)
		return service_errors.ErrInvalidCredentials
	}

	_, err := s.GetByID(ctx, userId, taskId)
	if err != nil {
		return err
	}

	err = s.repo.Task.UpdateByID(ctx, taskId, task)
	if err != nil {
		s.logger.Error(err)
		return service_errors.ErrServiceNotAvailable
	}
	return nil
}

func (s Service) DeleteByID(ctx context.Context, userId, taskId int) error {
	_, err := s.GetByID(ctx, userId, taskId)
	if err != nil {
		return err
	}

	err = s.repo.Task.DeleteByID(ctx, taskId)
	if err != nil {
		s.logger.Error(err)
		return service_errors.ErrServiceNotAvailable
	}
	return nil
}
