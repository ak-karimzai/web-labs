package ddo_test

import (
	"github.com/ak-karimzai/web-labs/pkg/ddo"
	"github.com/ak-karimzai/web-labs/util"
	"github.com/stretchr/testify/require"
	"testing"
)

func TestLogin_Validate(t *testing.T) {
	var login ddo.Login = ddo.Login{
		Username: util.RandomString(6),
		Password: util.RandomString(10),
	}
	
	require.Nil(t, login.Validate())
}
