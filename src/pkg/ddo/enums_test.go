package ddo_test

import (
	"github.com/ak-karimzai/web-labs/pkg/ddo"
	"github.com/stretchr/testify/require"
	"testing"
)

func TestFrequency_Validate(t *testing.T) {
	var frequency ddo.Frequency = ddo.Frequency("Daily")
	require.True(t, frequency.Validate())

	frequency = ddo.Frequency("Weekly")
	require.True(t, frequency.Validate())

	frequency = ddo.Frequency("Monthly")
	require.True(t, frequency.Validate())
}
