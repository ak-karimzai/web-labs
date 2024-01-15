package ddo

import "fmt"

// UpdateTask
// @Description Update task request credentials
type UpdateTask struct {
	Name        *string    `json:"name"`
	Description *string    `json:"description"`
	Frequency   *Frequency `json:"frequency"`
}

func (task UpdateTask) Validate() error {
	changes := 0
	if task.Name != nil {
		if length := len(*task.Name); length > MaxNameLen ||
			length < MinNameLen {
			return fmt.Errorf(
				"incorrect name {%s} length %d", *task.Name, length)
		}
		changes++
	}

	if task.Description != nil {
		if length := len(*task.Description); length > MaxDescriptionLen ||
			length < MinDescriptionLen {
			return fmt.Errorf(
				"incorrect description {%s} length %d", *task.Description, length)
		}
		changes++
	}

	if task.Frequency != nil {
		if !task.Frequency.Validate() {
			return fmt.Errorf(
				"incorrect completion status {%s}", *task.Frequency)
		}
		changes++
	}

	if changes == 0 {
		return ErrEmptyUpdate
	}

	return nil
}
