package db

import (
	"context"
	"fmt"
	"github.com/jackc/pgx/v5"
	"time"
)

type DB struct {
	*pgx.Conn
}

func NewPSQL(
	Host string,
	Port string,
	Username string,
	DBName string,
	SSLMode string,
	Password string,
) (*DB, error) {
	timeout, cancelFunc := context.WithTimeout(context.Background(), time.Second*10)
	defer cancelFunc()

	conn, err := pgx.Connect(timeout,
		fmt.Sprintf(
			"host=%s port=%s user=%s dbname=%s password=%s sslmode=%s",
			Host, Port, Username, DBName, Password, SSLMode),
	)

	if err != nil {
		return nil, err
	}

	timeout, cancelFunc = context.WithTimeout(context.Background(), time.Second*10)
	defer cancelFunc()

	err = conn.Ping(timeout)
	return &DB{conn}, err
}
