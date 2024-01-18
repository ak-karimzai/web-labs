package user

import (
	"context"
	"github.com/ak-karimzai/web-labs/internal/dto"
	"github.com/ak-karimzai/web-labs/internal/model"
	"github.com/ak-karimzai/web-labs/pkg/db"
	"github.com/ak-karimzai/web-labs/pkg/logger"
)

type Repository struct {
	db     *db.DB
	logger logger.Logger
}

func NewRepository(db *db.DB, logger logger.Logger) *Repository {
	return &Repository{db: db, logger: logger}
}

func (a Repository) SignUp(ctx context.Context, up dto.SignUp) error {
	query := `INSERT INTO 
    					users(first_name, last_name, username, password_hash) 
			  VALUES 
			      		($1, $2, $3, $4)`
	_, err := a.db.Exec(ctx,
		query,
		up.FirstName,
		up.LastName,
		up.Username,
		up.Password,
	)
	if err != nil {
		a.logger.Error(err)
		return a.db.ParseError(err)
	}
	return nil
}

func (a Repository) GetUserByName(ctx context.Context, username string) (model.User, error) {
	var user model.User
	query := `
		SELECT id, first_name, last_name, username, password_hash, created_at, updated_at 
		FROM users
		WHERE username = $1
	`

	row := a.db.QueryRow(ctx, query, username)

	err := row.Scan(
		&user.Id,
		&user.FirstName,
		&user.LastName,
		&user.Username,
		&user.Password,
		&user.CreatedAt,
		&user.UpdatedAt,
	)
	if err != nil {
		a.logger.Error(err)
		return model.User{}, a.db.ParseError(err)
	}

	return user, nil
}
