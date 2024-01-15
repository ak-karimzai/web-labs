package ddo

import (
	"github.com/ak-karimzai/web-labs/util"
	"github.com/stretchr/testify/require"
	"testing"
)

func TestEmptyStruct(test *testing.T) {
	var createGoal = CreateGoal{}

	require.Error(test, createGoal.Validate())
}

func TestEmptyName(t *testing.T) {
	var createGoal = CreateGoal{
		Name:        "",
		Description: util.RandomString(60),
	}

	require.Error(t, createGoal.Validate())
}

func TestEmptyDescription(t *testing.T) {
	var createGoal = CreateGoal{
		Name:        util.RandomString(6),
		Description: "",
	}

	require.Nil(t, createGoal.Validate())
}
