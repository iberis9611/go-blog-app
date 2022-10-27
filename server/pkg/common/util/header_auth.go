package util

import (
	"strings"
)

func BearerAuthHeader(authHeader string) string {
	// 判断token格式是否正确
	if authHeader == "" {
		return ""
	}

	parts := strings.Split(authHeader, "Bearer")
	if len(parts) != 2 {
		return ""
	}

	token := strings.TrimSpace(parts[1])
	if len(token) < 1 {
		return ""
	}

	return token
}
