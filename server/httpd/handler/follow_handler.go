package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/iberis9611/go-blog-application/httpd/router"
	"github.com/iberis9611/go-blog-application/pkg/common/response"
	"github.com/iberis9611/go-blog-application/service"
)

// 查询关注状态
func FollowStatus(c *gin.Context) {
	token := router.BearerAuthHeader(c)

	if token == "" {
		c.JSON(http.StatusUnauthorized, response.FailureMsg("用户未登录"))
		return
	}

	aid := c.Query("aid")

	c.JSON(http.StatusOK, response.SuccessMsg(service.FollowStatus(aid, token)))
}

// 点击关注
func ClickFollow(c *gin.Context) {
	token := router.BearerAuthHeader(c)
	if token == "" {
		c.JSON(http.StatusUnauthorized, response.FailureMsg("用户未登录"))
		return
	}

	aid := c.Query("aid")

	err := service.ClickFollow(aid, token)
	if err != nil {
		c.JSON(http.StatusBadRequest, response.FailureMsg("未知错误"))
		return
	}

	c.JSON(http.StatusOK, response.SuccessMsg(nil))
}
