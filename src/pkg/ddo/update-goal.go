package ddo

import (
	"errors"
	"fmt"
	"time"
)

var (
	ErrEmptyUpdate = errors.New("nothing to change")
)

// UpdateGoal
// @Description Update goal request credentials
type UpdateGoal struct {
	Name             *string           `json:"name"`
	Description      *string           `json:"description"`
	CompletionStatus *CompletionStatus `json:"completion_status"`
	StartDate        *time.Time        `json:"start_date"`
	TargetDate       *time.Time        `json:"target_date"`
}

func (goal UpdateGoal) Validate() error {
	changes := 0
	if goal.Name != nil {
		if length := len(*goal.Name); length > MaxNameLen ||
			length < MinNameLen {
			return fmt.Errorf(
				"incorrect name {%s} length %d", *goal.Name, length)
		}
		changes++
	}

	if goal.Description != nil {
		if length := len(*goal.Description); length > MaxDescriptionLen ||
			length < MinDescriptionLen {
			return fmt.Errorf(
				"incorrect description {%s} length %d", *goal.Description, length)
		}
		changes++
	}

	if goal.CompletionStatus != nil {
		if !goal.CompletionStatus.Validate() {
			return fmt.Errorf(
				"incorrect completion status {%s}", *goal.CompletionStatus)
		}
		changes++
	}

	if goal.StartDate != nil {
		changes++
	}

	if goal.TargetDate != nil {
		changes++
	}

	if changes == 0 {
		return ErrEmptyUpdate
	}

	return nil
}
