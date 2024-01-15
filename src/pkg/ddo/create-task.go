package ddo

import "fmt"

// CreateTask task create request
// @Description Task request requirments
type CreateTask struct {
	Name        string    `json:"name" 		  binding:"required"`
	Description string    `json:"description" binding:"required"`
	Frequency   Frequency `json:"frequency"   binding:"required"`
}

func (ct CreateTask) Validate() error {
	if length := len(ct.Name); length > MaxNameLen ||
		length < MinNameLen {
		return fmt.Errorf(
			"incorrect username {%s} length %d", ct.Name, length)
	}

	if length := len(ct.Description); length < MinDescriptionLen ||
		length > MaxDescriptionLen {
		return fmt.Errorf(
			"incorrect username {%s} length %d", ct.Description, length)
	}

	if !ct.Frequency.Validate() {
		return fmt.Errorf(
			"incorrect frequency {%s}", ct.Frequency)
	}

	return nil
}
