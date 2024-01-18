package dto

import (
	"fmt"
	"time"
)

const (
	MinNameLen        = 3
	MaxNameLen        = 64
	MinDescriptionLen = 0
	MaxDescriptionLen = 256
)

// CreateGoal goal create request
// @Description Create request requirments
type CreateGoal struct {
	Name        string    `json:"name"	  	  binding:"required"`
	Description string    `json:"description" binding:"required"`
	StartDate   time.Time `json:"start_date"  binding:"required"`
	TargetDate  time.Time `json:"target_date" binding:"required"`
}

func (cg CreateGoal) Validate() error {
	if length := len(cg.Name); length > MaxNameLen ||
		length < MinNameLen {
		return fmt.Errorf(
			"incorrect username {%s} length %d", cg.Name, length)
	}

	if length := len(cg.Description); length < MinDescriptionLen ||
		length > MaxDescriptionLen {
		return fmt.Errorf(
			"incorrect username {%s} length %d", cg.Description, length)
	}

	return nil
}
