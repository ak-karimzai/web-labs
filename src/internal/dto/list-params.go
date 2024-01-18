package dto

import "fmt"

const (
	MinPageSize = 5
	MaxPageSize = 20
)

// ListParams
// @Description Parameters for get all request
type ListParams struct {
	PageID   int `form:"page_id" 	binding:"required"`
	PageSize int `form:"page_size" 	binding:"required"`
}

func (lp ListParams) Validate() error {
	if lp.PageID <= 0 {
		return fmt.Errorf("incorrect page_id: %d", lp.PageID)
	}

	if lp.PageSize > MaxPageSize || lp.PageSize < MinPageSize {
		return fmt.Errorf("incorrect page_size: %d", lp.PageSize)
	}
	return nil
}
