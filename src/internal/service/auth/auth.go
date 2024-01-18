package auth

import (
	"context"
	"errors"
	"github.com/ak-karimzai/web-labs/internal/dto"
	"github.com/ak-karimzai/web-labs/internal/repository"
	service_errors "github.com/ak-karimzai/web-labs/internal/service/service-errors"
	"github.com/ak-karimzai/web-labs/pkg/auth-token"
	"github.com/ak-karimzai/web-labs/pkg/db"
	"github.com/ak-karimzai/web-labs/pkg/logger"
	"github.com/ak-karimzai/web-labs/pkg/util"
)

type Service struct {
	repo       *repository.Repository
	tokenMaker auth_token.Maker
	logger     logger.Logger
}

func NewService(repo *repository.Repository, tokenMaker auth_token.Maker, logger logger.Logger) *Service {
	return &Service{repo: repo, tokenMaker: tokenMaker, logger: logger}
}

func (s Service) SignUp(ctx context.Context, up dto.SignUp) error {
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

func (s Service) Login(ctx context.Context, in dto.Login) (*dto.LoginResponse, error) {
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

	return dto.NewLoginResponse(token, user), nil
}
