package model

import "time"

type Goal struct {
	ID               int       `json:"id"`
	Name             string    `json:"name"`
	Description      string    `json:"description"`
	CompletionStatus string    `json:"completion_status"`
	StartDate        time.Time `json:"start_date"`
	TargetDate       time.Time `json:"target_date"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
	UserID           int       `json:"-"`
}
