package goal

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

func (s Service) Create(ctx context.Context, userId int, goal ddo.CreateGoal) (model.Goal, error) {
	if err := goal.Validate(); err != nil {
		s.logger.Error(err)
		return model.Goal{}, service_errors.ErrInvalidCredentials
	}

	id, err := s.repo.Goal.Create(ctx, userId, goal)
	if err != nil {
		s.logger.Error(err)
		return model.Goal{},
			service_errors.ErrServiceNotAvailable
	}

	goalFromDB, err := s.repo.Goal.GetByID(ctx, id)
	if err != nil {
		s.logger.Error(err)
		var err = service_errors.ErrServiceNotAvailable
		if errors.Is(err, db.ErrNotFound) {
			err = service_errors.ErrNotFound
		}
		return model.Goal{}, err
	}
	return goalFromDB, nil
}

func (s Service) Get(ctx context.Context, userId int, listParams ddo.ListParams) ([]model.Goal, error) {
	if err := listParams.Validate(); err != nil {
		s.logger.Error(err)
		return []model.Goal{}, service_errors.ErrInvalidCredentials
	}

	goals, err := s.repo.Goal.Get(ctx, userId, listParams)
	if err != nil {
		s.logger.Error(err)
		var err = service_errors.ErrServiceNotAvailable
		if errors.Is(err, db.ErrNotFound) {
			err = service_errors.ErrNotFound
		}
		return []model.Goal{}, err
	}
	return goals, nil
}

func (s Service) GetByID(ctx context.Context, userId, goalId int) (model.Goal, error) {
	goal, err := s.repo.Goal.GetByID(ctx, goalId)
	if err != nil {
		s.logger.Error(err)
		if errors.Is(err, db.ErrNotFound) {
			return model.Goal{}, service_errors.ErrNotFound
		}
		return model.Goal{}, service_errors.ErrServiceNotAvailable
	}

	if goal.UserID != userId {
		return model.Goal{}, service_errors.ErrPermissionDenied
	}

	return goal, nil
}

func (s Service) UpdateByID(ctx context.Context, userId, goalId int, update ddo.UpdateGoal) error {
	if err := update.Validate(); err != nil {
		s.logger.Error(err)
		return service_errors.ErrInvalidCredentials
	}

	_, err := s.GetByID(ctx, userId, goalId)
	if err != nil {
		s.logger.Error(err)
		return err
	}

	err = s.repo.Goal.UpdateByID(ctx, goalId, update)
	if err != nil {
		s.logger.Error(err)
		return service_errors.ErrServiceNotAvailable
	}
	return nil
}

func (s Service) DeleteByID(ctx context.Context, userId, goalId int) error {
	_, err := s.GetByID(ctx, userId, goalId)
	if err != nil {
		s.logger.Error(err)
		return err
	}

	err = s.repo.Goal.DeleteByID(ctx, goalId)
	if err != nil {
		s.logger.Error(err)
		return service_errors.ErrServiceNotAvailable
	}
	return nil
}
