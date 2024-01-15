package auth

import (
	"context"
	"errors"
	"github.com/ak-karimzai/web-labs/pkg/db"
	"github.com/ak-karimzai/web-labs/pkg/ddo"
	"github.com/ak-karimzai/web-labs/pkg/logger"
	"github.com/ak-karimzai/web-labs/pkg/maker"
	"github.com/ak-karimzai/web-labs/pkg/repository"
	service_errors "github.com/ak-karimzai/web-labs/pkg/service/service-errors"
	"github.com/ak-karimzai/web-labs/util"
)

type Service struct {
	repo       *repository.Repository
	tokenMaker maker.Maker
	logger     logger.Logger
}

func NewService(repo *repository.Repository, tokenMaker maker.Maker, logger logger.Logger) *Service {
	return &Service{repo: repo, tokenMaker: tokenMaker, logger: logger}
}

func (s Service) SignUp(ctx context.Context, up ddo.SignUp) error {
	if err := up.Validate(); err != nil {
		s.logger.Error(err)
		return err
	}

	hashedPwd, err := util.HashPasswrod(up.Password)
	if err != nil {
		s.logger.Error(err)
		return service_errors.ErrServiceNotAvailable
	}
	up.Password = hashedPwd
	if err := s.repo.SignUp(ctx, up); err != nil {
		s.logger.Error(err)
		if errors.Is(err, db.ErrConflict) {
			return service_errors.ErrAlreadyExists
		}
		return service_errors.ErrServiceNotAvailable
	}

	return nil
}

func (s Service) Login(ctx context.Context, in ddo.Login) (*ddo.LoginResponse, error) {
	if err := in.Validate(); err != nil {
		s.logger.Error(err)
		return nil, err
	}

	user, err := s.repo.GetUserByName(ctx, in.Username)
	if err != nil {
		s.logger.Error(err)
		if errors.Is(err, db.ErrNotFound) {
			return nil, service_errors.ErrNotFound
		}
		return nil, err
	}

	if err := util.CheckPwd(
		in.Password, user.Password); err != nil {
		s.logger.Error(err)
		return nil, service_errors.ErrServiceNotAvailable
	}

	token, err := s.tokenMaker.CreateToken(user.Id, user.Username)
	if err != nil {
		s.logger.Error(err)
		return nil, service_errors.ErrInvalidCredentials
	}

	return ddo.NewLoginResponse(token, user), nil
}
