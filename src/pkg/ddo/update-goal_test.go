package ddo_test

import (
	"github.com/ak-karimzai/web-labs/pkg/ddo"
	"github.com/stretchr/testify/require"
	"testing"
)

func TestUpdateGoal_NothingToUpdate(t *testing.T) {
	var updateGoal ddo.UpdateGoal
	require.EqualError(t, updateGoal.Validate(), ddo.ErrEmptyUpdate.Error())
}
